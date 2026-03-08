if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface LoginBottom_Params {
    account?: string;
    password?: string;
    isRememberPassword?: boolean;
    isPasswordVisible?: boolean;
    passwordIconRes?: Resource;
    passwordController?: TextInputController;
}
interface LoginTitle_Params {
}
interface Login_Params {
    eyeMode?: boolean;
}
import promptAction from "@ohos:promptAction";
import router from "@ohos:router";
import { StorageUtil } from "@bundle:com.example.readerkitdemo/entry/ets/utils/StorageUtil";
import hilog from "@ohos:hilog";
const TAG: string = "Login";
class Login extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__eyeMode = this.createStorageLink('eyeMode', false, "eyeMode");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Login_Params) {
    }
    updateStateVars(params: Login_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__eyeMode.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__eyeMode.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __eyeMode: ObservedPropertyAbstractPU<boolean>;
    get eyeMode() {
        return this.__eyeMode.get();
    }
    set eyeMode(newValue: boolean) {
        this.__eyeMode.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.backgroundColor(this.eyeMode ? '#FAF9DE' : { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.readerkitdemo", "moduleName": "entry" });
        }, Column);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // Title component
                    LoginTitle(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Login.ets", line: 23, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {};
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                }
            }, { name: "LoginTitle" });
        }
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // Bottom component
                    LoginBottom(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Login.ets", line: 25, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {};
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                }
            }, { name: "LoginBottom" });
        }
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Login";
    }
}
class LoginTitle extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: LoginTitle_Params) {
    }
    updateStateVars(params: LoginTitle_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height("40%");
            Column.justifyContent(FlexAlign.Center);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777217, "type": 20000, params: [], "bundleName": "com.example.readerkitdemo", "moduleName": "entry" });
            Image.width(100);
            Image.height(100);
            Image.margin({ bottom: 7 });
            Image.borderRadius(10);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create("登录界面");
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor("#ff000000");
        }, Text);
        Text.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
class LoginBottom extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__account = new ObservedPropertySimplePU('', this, "account");
        this.__password = new ObservedPropertySimplePU('', this, "password");
        this.__isRememberPassword = new ObservedPropertySimplePU(false, this, "isRememberPassword");
        this.__isPasswordVisible = new ObservedPropertySimplePU(false, this, "isPasswordVisible");
        this.__passwordIconRes = new ObservedPropertyObjectPU({ "id": 16777283, "type": 20000, params: [], "bundleName": "com.example.readerkitdemo", "moduleName": "entry" }, this, "passwordIconRes");
        this.passwordController = new TextInputController();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: LoginBottom_Params) {
        if (params.account !== undefined) {
            this.account = params.account;
        }
        if (params.password !== undefined) {
            this.password = params.password;
        }
        if (params.isRememberPassword !== undefined) {
            this.isRememberPassword = params.isRememberPassword;
        }
        if (params.isPasswordVisible !== undefined) {
            this.isPasswordVisible = params.isPasswordVisible;
        }
        if (params.passwordIconRes !== undefined) {
            this.passwordIconRes = params.passwordIconRes;
        }
        if (params.passwordController !== undefined) {
            this.passwordController = params.passwordController;
        }
    }
    updateStateVars(params: LoginBottom_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__account.purgeDependencyOnElmtId(rmElmtId);
        this.__password.purgeDependencyOnElmtId(rmElmtId);
        this.__isRememberPassword.purgeDependencyOnElmtId(rmElmtId);
        this.__isPasswordVisible.purgeDependencyOnElmtId(rmElmtId);
        this.__passwordIconRes.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__account.aboutToBeDeleted();
        this.__password.aboutToBeDeleted();
        this.__isRememberPassword.aboutToBeDeleted();
        this.__isPasswordVisible.aboutToBeDeleted();
        this.__passwordIconRes.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __account: ObservedPropertySimplePU<string>;
    get account() {
        return this.__account.get();
    }
    set account(newValue: string) {
        this.__account.set(newValue);
    }
    private __password: ObservedPropertySimplePU<string>;
    get password() {
        return this.__password.get();
    }
    set password(newValue: string) {
        this.__password.set(newValue);
    }
    private __isRememberPassword: ObservedPropertySimplePU<boolean>; // 是否记住密码
    get isRememberPassword() {
        return this.__isRememberPassword.get();
    }
    set isRememberPassword(newValue: boolean) {
        this.__isRememberPassword.set(newValue);
    }
    private __isPasswordVisible: ObservedPropertySimplePU<boolean>; //控制密码是否可见
    get isPasswordVisible() {
        return this.__isPasswordVisible.get();
    }
    set isPasswordVisible(newValue: boolean) {
        this.__isPasswordVisible.set(newValue);
    }
    private __passwordIconRes: ObservedPropertyObjectPU<Resource>; //密码图标资源
    get passwordIconRes() {
        return this.__passwordIconRes.get();
    }
    set passwordIconRes(newValue: Resource) {
        this.__passwordIconRes.set(newValue);
    }
    private passwordController: TextInputController; //密码输入框控制器
    // 组件初始化时加载已保存的用户信息
    async aboutToAppear(): Promise<void> {
        await this.loadSavedUserInfo();
    }
    // 加载已保存的用户信息
    private async loadSavedUserInfo(): Promise<void> {
        this.isRememberPassword = await StorageUtil.isRememberPassword();
        this.account = await StorageUtil.getUserAccount();
        if (this.isRememberPassword) {
            this.password = await StorageUtil.getUserPassword();
        }
    }
    //模拟登录逻辑（实际项目中替换为接口请求）
    private async simulateLogin(): Promise<boolean> {
        //return this.account === 'admin' && this.password === '123456';
        // 获取所有用户数据
        const users = await StorageUtil.getAllUsers();
        const account = this.account.trim();
        const password = this.password.trim();
        if (!account || !password) {
            promptAction.showToast({ message: '账号和密码不能为空', duration: 2000 });
            return false;
        }
        // 检查账号是否存在
        if (users[account] !== undefined) {
            // 账号存在，验证密码
            if (users[account] === password) {
                return true; // 密码正确
            }
            else {
                promptAction.showToast({ message: '密码错误', duration: 2000 });
                return false;
            }
        }
        else {
            // 账号不存在，视为注册：保存新用户
            await StorageUtil.saveUser(account, password);
            promptAction.showToast({ message: '注册成功，自动登录', duration: 2000 });
            return true;
        }
    }
    //切换密码可见性
    private togglePasswordVisibility(): void {
        this.isPasswordVisible = !this.isPasswordVisible;
        this.passwordIconRes = this.isPasswordVisible ? { "id": 16777284, "type": 20000, params: [], "bundleName": "com.example.readerkitdemo", "moduleName": "entry" } : { "id": 16777283, "type": 20000, params: [], "bundleName": "com.example.readerkitdemo", "moduleName": "entry" };
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding({ left: 12, right: 12, top: 12 });
            Column.height('60%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.backgroundColor(Color.White);
            Column.borderRadius(24);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: { "id": 16777224, "type": 10003, params: [], "bundleName": "com.example.readerkitdemo", "moduleName": "entry" } });
            TextInput.maxLength(11);
            TextInput.type(InputType.USER_NAME);
            TextInput.placeholderColor("#99182431");
            TextInput.height(48);
            TextInput.fontSize(16);
            TextInput.fontColor(Color.Black);
            TextInput.backgroundColor(Color.White);
            TextInput.margin({ top: 4 });
            TextInput.padding({ left: 12 });
            TextInput.onChange((value: string) => {
                this.account = value;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.color('#E5E5E5');
            Divider.strokeWidth(1);
            Divider.margin({ left: 10, right: 10 });
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            //密码输入框
            Stack.create({ alignContent: Alignment.End });
            //密码输入框
            Stack.width('100%');
            //密码输入框
            Stack.height(48);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: { "id": 16777235, "type": 10003, params: [], "bundleName": "com.example.readerkitdemo", "moduleName": "entry" }, controller: this.passwordController });
            TextInput.maxLength(11);
            TextInput.type(InputType.Password);
            TextInput.showPasswordIcon(false);
            TextInput.showPassword(this.isPasswordVisible);
            TextInput.placeholderColor("#99182431");
            TextInput.height(48);
            TextInput.fontSize(16);
            TextInput.fontColor(Color.Black);
            TextInput.backgroundColor(Color.White);
            TextInput.margin({ top: 4 });
            TextInput.padding({ left: 12, right: 40 });
            TextInput.onChange((value: string) => {
                this.password = value;
            });
            TextInput.width('100%');
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.passwordIconRes);
            Image.width(24);
            Image.height(24);
            Image.margin({ right: 12 });
            Image.align(Alignment.End);
            Image.onClick(() => {
                this.togglePasswordVisibility();
            });
        }, Image);
        //密码输入框
        Stack.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            //记住密码
            Row.create();
            //记住密码
            Row.width('80%');
            //记住密码
            Row.justifyContent(FlexAlign.Start);
            //记住密码
            Row.margin({ top: 20 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Checkbox.create({ name: 'remember', group: 'login' });
            Checkbox.select(this.isRememberPassword);
            Checkbox.selectedColor("#007DFF");
            Checkbox.onChange((value: boolean) => {
                this.isRememberPassword = value;
            });
        }, Checkbox);
        Checkbox.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create("记住密码");
            Text.fontSize(14);
            Text.fontColor("#666666");
            Text.onClick(() => {
                this.isRememberPassword = !this.isRememberPassword;
            });
        }, Text);
        Text.pop();
        //记住密码
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel("登录");
            Button.width("80%");
            Button.height(40);
            Button.fontSize(16);
            Button.fontWeight(FontWeight.Medium);
            Button.backgroundColor("#007DFF");
            Button.margin({
                top: 20,
                bottom: 12
            });
            Button.onClick(async () => {
                const isSuccess = await this.simulateLogin();
                if (isSuccess) {
                    // 登录成功：保存记住密码相关信息
                    await StorageUtil.saveUserInfo(this.account, this.password, this.isRememberPassword);
                    // 设置登录状态
                    await StorageUtil.setLoggedIn(this.account);
                    hilog.info(0x0000, TAG, 'Login successful, setting login status for account: ' + this.account);
                    AppStorage.setOrCreate('currentUser', this.account);
                    // 登录成功后返回到Tab页面，用户可以通过下拉刷新更新Mine页面状态
                    router.back();
                    AppStorage.setOrCreate('currentUser', this.account);
                    // 显示登录成功提示
                    promptAction.showToast({ message: '登录成功', duration: 1500 });
                }
                else {
                    promptAction.showToast({
                        message: '用户名或密码错误！',
                        duration: 3000
                    });
                }
            });
            Button.width('80%');
            Button.height(40);
        }, Button);
        Button.pop();
        Column.pop();
    }
    pageTransition() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            PageTransition.create();
        }, null);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            PageTransitionEnter.create({ duration: 0, curve: Curve.Sharp });
        }, null);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            PageTransitionExit.create({ duration: 0, curve: Curve.Sharp });
        }, null);
        PageTransition.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
registerNamedRoute(() => new Login(undefined, {}), "", { bundleName: "com.example.readerkitdemo", moduleName: "entry", pagePath: "pages/Login", pageFullPath: "entry/src/main/ets/pages/Login", integratedHsp: "false", moduleType: "followWithHap" });
