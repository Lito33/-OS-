import { preferences } from '@kit.ArkData';
import { common } from '@kit.AbilityKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

const TAG = "ProgressStorage"

export interface BookProgress {
  filePath: string;
  resourceIndex: number;
  startDomPos: string;
  chapterName: string;
  lastReadTime: number;
}

export class ProgressStorage {
  private static getStoreName(account?: string): string {
    return account ? `reader_progress_${account}` : 'reader_progress_default';
  }

  static async saveAllProgresses(
    context: common.UIAbilityContext,
    progresses: BookProgress[],
    account?: string
  ): Promise<void> {
    const storeName = ProgressStorage.getStoreName(account);
    hilog.info(0x0000,TAG,`ProgressStorage: saving to ${storeName}, count=${progresses.length}`);
    const pref = await preferences.getPreferences(context, storeName);
    await pref.put('book_progress', JSON.stringify(progresses));
    await pref.flush();
  }

  static async loadAllProgresses(
    context: common.UIAbilityContext,
    account?: string
  ): Promise<BookProgress[]> {
    const storeName = ProgressStorage.getStoreName(account);
    hilog.info(0x000,TAG,`ProgressStorage: loading from ${storeName}`)
    const pref = await preferences.getPreferences(context, storeName);
    const json = await pref.get('book_progress', '[]');
    try {
      const progresses = JSON.parse(json as string) as BookProgress[];
      hilog.info(0x000,TAG,`ProgressStorage: loaded ${progresses.length} records from ${storeName}`)
      return progresses;
    } catch {
      hilog.info(0x000,TAG,`ProgressStorage: failed to parse JSON from ${storeName}`)
      return [];
    }
  }

  static async saveProgress(
    context: common.UIAbilityContext,
    progress: BookProgress,
    account?: string
  ): Promise<void> {
    const progresses = await ProgressStorage.loadAllProgresses(context, account);
    const index = progresses.findIndex(p => p.filePath === progress.filePath);
    
    //手动合并对象属性，避免使用扩展运算符
    const newProgress: BookProgress = {
      filePath: progress.filePath,
      resourceIndex: progress.resourceIndex,
      startDomPos: progress.startDomPos,
      chapterName: progress.chapterName,
      lastReadTime: Date.now()
    };
    
    if (index >= 0) {
      progresses[index] = newProgress;
    } else {
      progresses.push(newProgress);
    }
    await ProgressStorage.saveAllProgresses(context, progresses, account);
  }

  static async getProgress(
    context: common.UIAbilityContext,
    filePath: string,
    account?: string
  ): Promise<BookProgress> {
    const progresses = await ProgressStorage.loadAllProgresses(context, account);
    const foundProgress = progresses.find(p => p.filePath === filePath);
    
    if (foundProgress) {
      return foundProgress;
    } else {
      // 返回默认的进度对象
      const defaultProgress: BookProgress = {
        filePath: filePath,
        resourceIndex: 0,
        startDomPos: '',
        chapterName: '',
        lastReadTime: 0
      };
      return defaultProgress;
    }
  }
}