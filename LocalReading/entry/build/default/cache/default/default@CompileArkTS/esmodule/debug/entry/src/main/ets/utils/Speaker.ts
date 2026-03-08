import textToSpeech from "@hms:ai.textToSpeech";
import type { BusinessError } from "@ohos:base";
import hilog from "@ohos:hilog";
const TAG = 'Speaker';
export class Speaker {
    private ttsEngine?: textToSpeech.TextToSpeechEngine;
    private engineReadyPromise: Promise<void>;
    private resolveEngineReady!: () => void;
    private rejectEngineReady!: (reason?: BusinessError) => void;
    // 引擎配置参数
    private initParams: textToSpeech.CreateEngineParams = {
        language: 'zh-CN',
        person: 0,
        online: 1,
        extraParams: { "style": 'interaction-broadcast' }
    };
    // 播报参数
    private speakParams: textToSpeech.SpeakParams = {
        requestId: '',
        extraParams: {
            "queueMode": 0,
            "speed": 1,
            "volume": 2,
            "pitch": 1,
            "audioType": "pcm",
            "playType": 1 // 合成并播放
        }
    };
    // 分块大小（字符数）
    private readonly CHUNK_SIZE = 500;
    constructor() {
        this.engineReadyPromise = new Promise((resolve, reject) => {
            this.resolveEngineReady = resolve;
            this.rejectEngineReady = reject;
        });
        this.createEngine();
    }
    private createEngine() {
        try {
            textToSpeech.createEngine(this.initParams, (err: BusinessError, engine: textToSpeech.TextToSpeechEngine) => {
                if (err) {
                    hilog.error(0x0000, TAG, `createEngine failed: ${err.code}, ${err.message}`);
                    this.rejectEngineReady(err);
                    return;
                }
                this.ttsEngine = engine;
                this.setListener();
                hilog.info(0x0000, TAG, 'TTS Engine created and listener set.');
                this.resolveEngineReady();
            });
        }
        catch (error) {
            hilog.error(0x0000, TAG, `createEngine exception: ${error}`);
            this.rejectEngineReady(error);
        }
    }
    private setListener() {
        if (!this.ttsEngine)
            return;
        const listener: textToSpeech.SpeakListener = {
            onStart: (requestId, response) => {
                hilog.info(0x0000, TAG, `onStart: ${requestId}`);
            },
            onComplete: (requestId, response) => {
                hilog.info(0x0000, TAG, `onComplete: ${requestId}`);
            },
            onStop: (requestId, response) => {
                hilog.info(0x0000, TAG, `onStop: ${requestId}`);
            },
            onError: (requestId, errorCode, errorMessage) => {
                hilog.error(0x0000, TAG, `onError: ${requestId}, code:${errorCode}, msg:${errorMessage}`);
            },
            onData: (requestId, audio, response) => { }
        };
        this.ttsEngine.setListener(listener);
    }
    public async startSpeak(text: string): Promise<void> {
        if (!text) {
            hilog.warn(0x0000, TAG, 'startSpeak called with empty text.');
            return;
        }
        try {
            await this.engineReadyPromise;
            if (!this.ttsEngine) {
                throw new Error('TTS Engine is not available.');
            }
            // 将长文本分块
            const chunks: string[] = [];
            for (let i = 0; i < text.length; i += this.CHUNK_SIZE) {
                chunks.push(text.substring(i, i + this.CHUNK_SIZE));
            }
            hilog.info(0x0000, TAG, `Text split into ${chunks.length} chunks.`);
            // 依次合成每一块（引擎内部会排队）
            for (const chunk of chunks) {
                const requestId = `speak_${Date.now()}_${Math.random().toString(36).substring(2)}`;
                // 每次使用新的 extraParams 副本，避免相互影响
                const extraParamsCopy: Record<string, Object> = {
                    "queueMode": this.speakParams.extraParams?.queueMode ?? 0,
                    "speed": this.speakParams.extraParams?.speed ?? 1,
                    "volume": this.speakParams.extraParams?.volume ?? 2,
                    "pitch": this.speakParams.extraParams?.pitch ?? 1,
                    "audioType": this.speakParams.extraParams?.audioType ?? "pcm",
                    "playType": this.speakParams.extraParams?.playType ?? 1
                };
                const params: textToSpeech.SpeakParams = {
                    requestId: requestId,
                    extraParams: extraParamsCopy
                };
                this.ttsEngine.speak(chunk, params);
                hilog.info(0x0000, TAG, `Queued chunk, requestId: ${requestId}, length: ${chunk.length}`);
                // 可适当延时，但不是必须的
                await new Promise<void>(resolve => setTimeout(resolve, 10));
            }
        }
        catch (error) {
            hilog.error(0x0000, TAG, `startSpeak failed: ${error}`);
        }
    }
    public stopSpeak() {
        this.ttsEngine?.stop();
        hilog.info(0x0000, TAG, 'stopSpeak called.');
    }
    public shutdown() {
        this.ttsEngine?.shutdown();
        hilog.info(0x0000, TAG, 'shutdown called.');
    }
}
