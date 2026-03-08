import { promptAction, router } from '@kit.ArkUI';
import { StorageUtil } from '../utils/StorageUtil';
import { hilog } from '@kit.PerformanceAnalysisKit';


const TAG: string = "Login"

@Entry
@Component
struct Login{

  @StorageLink('eyeMode') eyeMode: boolean = false;







  build() {
    Column() {
      // Title component
      LoginTitle()
      // Bottom component
      LoginBottom()
    }
    .backgroundColor(this.eyeMode ? '#FAF9DE' : $r('app.color.page_background1'))
  }
}


@Preview
@Component
struct LoginTitle{
  build() {
    Column(){
      Image($r('app.media.appLogo'))
        .width(100)
        .height(100)
        .margin({bottom:7})
        .borderRadius(10)

      Text("登录界面")
        .fontSize(24)
        .fontWeight(FontWeight.Medium)
        .fontColor("#ff000000")
    }
    .width('100%')
    .height("40%")
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
    //.backgroundColor(Color.Blue)

  }
}

@Preview
@Component
struct LoginBottom{
  @State account: string = '';
  @State password: string = '';
  @State isRememberPassword: boolean = false; // 是否记住密码

  @State isPasswordVisible: boolean = false;//控制密码是否可见
  @State passwordIconRes: Resource = $r('app.media.eye_off');//密码图标资源
  passwordController: TextInputController = new TextInputController();//密码输入框控制器

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
      } else {
        promptAction.showToast({ message: '密码错误', duration: 2000 });
        return false;
      }
    } else {
      // 账号不存在，视为注册：保存新用户
      await StorageUtil.saveUser(account, password);
      promptAction.showToast({ message: '注册成功，自动登录', duration: 2000 });
      return true;
    }
  }

  //切换密码可见性
  private togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
    this.passwordIconRes = this.isPasswordVisible ? $r('app.media.eye_on') : $r('app.media.eye_off');
  }


  build() {
    Column(){
      Column() {
        TextInput({ placeholder: $r('app.string.account') })
          .maxLength(11)
          .type(InputType.USER_NAME)
          .placeholderColor("#99182431")
          .height(48)
          .fontSize(16)
          .fontColor(Color.Black)
          .backgroundColor(Color.White)
          .margin({top:4})
          .padding({left:12})
          .onChange((value: string) => {
            this.account = value;
          })

        Divider()
          .color('#E5E5E5')
          .strokeWidth(1)
          .margin({left: 10, right: 10})

        //密码输入框
        Stack({ alignContent: Alignment.End }) {
          TextInput({ placeholder: $r('app.string.password'), controller: this.passwordController })
            .maxLength(11)
            .type(InputType.Password)
            .showPasswordIcon(false)//禁用默认图标，使用自定义图标
            .showPassword(this.isPasswordVisible)//控制密码显示状态
            .placeholderColor("#99182431")
            .height(48)
            .fontSize(16)
            .fontColor(Color.Black)
            .backgroundColor(Color.White)
            .margin({top:4})
            .padding({left:12, right: 40})
            .onChange((value: string) => {
              this.password = value;
            })
            .width('100%')


          Image(this.passwordIconRes)
            .width(24)
            .height(24)
            .margin({right: 12})
            .align(Alignment.End)
            .onClick(() => {
              this.togglePasswordVisibility();
            })
        }
        .width('100%')
        .height(48)
      }
      .backgroundColor(Color.White)
      .borderRadius(24)

      //记住密码
      Row() {
        Checkbox({ name: 'remember', group: 'login' })
          .select(this.isRememberPassword)
          .selectedColor("#007DFF")
          .onChange((value: boolean) => {
            this.isRememberPassword = value;
          })

        Text("记住密码")
          .fontSize(14)
          .fontColor("#666666")
          .onClick(() => {
            this.isRememberPassword = !this.isRememberPassword;
          })
      }
      .width('80%')
      .justifyContent(FlexAlign.Start)
      .margin({ top: 20 })

      Button("登录")
        .width("80%")
        .height(40)
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .backgroundColor("#007DFF")
        .margin({
          top: 20,
          bottom: 12
        })
        .onClick(async () => {

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
          } else {
            promptAction.showToast({
              message: '用户名或密码错误！',
              duration: 3000
            });
          }
        })
        .width('80%')
        .height(40)

    }
    .padding({left:12,right:12,top:12})
    .height('60%')




  }
  pageTransition() {
    PageTransitionEnter({ duration: 0, curve: Curve.Sharp });
    PageTransitionExit({ duration: 0, curve: Curve.Sharp });
  }
}