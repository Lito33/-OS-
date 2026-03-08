import preferences from '@ohos.data.preferences';
import { GlobalContext } from './GlobalContext'

export class StorageUtil {
  // 存储键名常量
  private static readonly USER_DATA_KEY: string = 'user_data';           // 存储所有用户 {账号: 密码}
  private static readonly IS_LOGGED_IN_KEY: string = 'is_logged_in';     // 登录状态
  private static readonly CURRENT_USER_KEY: string = 'current_user';     // 当前登录用户名

  // 以下为记住密码相关（保持原有）
  private static readonly USER_ACCOUNT_KEY: string = 'user_account';
  private static readonly USER_PASSWORD_KEY: string = 'user_password';
  private static readonly IS_REMEMBER_KEY: string = 'is_remember';

  private static prefs: preferences.Preferences | null = null;


  private static async initPreferences(): Promise<void> {
    if (!StorageUtil.prefs) {
      try {
        const context = GlobalContext.getInstance().getContext();
        StorageUtil.prefs = await preferences.getPreferences(context, 'login_preferences');
        console.info('StorageUtil: Preferences initialized successfully');
      } catch (error) {
        console.error('StorageUtil: initPreferences failed', JSON.stringify(error));
      }
    }
  }

  // ---------- 多用户数据管理 ----------
  /** 获取所有用户数据（返回对象 {账号: 密码}） */
  static async getAllUsers(): Promise<Record<string, string>> {
    await StorageUtil.initPreferences();
    try {
      const json = await StorageUtil.prefs?.get(StorageUtil.USER_DATA_KEY, '{}');
      return JSON.parse(json as string);
    } catch {
      return {};
    }
  }

  /** 保存所有用户数据 */
  static async saveAllUsers(users: Record<string, string>): Promise<void> {
    await StorageUtil.initPreferences();
    try {
      await StorageUtil.prefs?.put(StorageUtil.USER_DATA_KEY, JSON.stringify(users));
      await StorageUtil.prefs?.flush();
    } catch (error) {
      console.error('保存用户数据失败:', error);
    }
  }

  /** 添加或更新用户（注册/修改密码） */
  static async saveUser(account: string, password: string): Promise<void> {
    const users = await StorageUtil.getAllUsers();
    users[account] = password;
    await StorageUtil.saveAllUsers(users);
  }

  /** 检查账号是否存在 */
  static async userExists(account: string): Promise<boolean> {
    const users = await StorageUtil.getAllUsers();
    return users[account] !== undefined;
  }

  /** 验证密码是否正确 */
  static async verifyPassword(account: string, password: string): Promise<boolean> {
    const users = await StorageUtil.getAllUsers();
    return users[account] === password;
  }

  // ---------- 登录状态管理 ----------
  /** 设置登录状态（登录成功时调用） */
  static async setLoggedIn(account: string): Promise<void> {
    await StorageUtil.initPreferences();
    try {
      await StorageUtil.prefs?.put(StorageUtil.IS_LOGGED_IN_KEY, true);
      await StorageUtil.prefs?.put(StorageUtil.CURRENT_USER_KEY, account);
      await StorageUtil.prefs?.flush();
    } catch (error) {
      console.error('设置登录状态失败:', error);
    }
  }

  /** 退出登录 */
  static async setLoggedOut(): Promise<void> {
    await StorageUtil.initPreferences();
    try {
      await StorageUtil.prefs?.put(StorageUtil.IS_LOGGED_IN_KEY, false);
      await StorageUtil.prefs?.delete(StorageUtil.CURRENT_USER_KEY);
      await StorageUtil.prefs?.flush();
    } catch (error) {
      console.error('退出登录失败:', error);
    }
  }

  /** 获取登录状态 */
  static async isLoggedIn(): Promise<boolean> {
    await StorageUtil.initPreferences();
    try {
      const val = await StorageUtil.prefs?.get(StorageUtil.IS_LOGGED_IN_KEY, false);
      return Boolean(val);
    } catch {
      return false;
    }
  }

  /** 获取当前登录用户名 */
  static async getCurrentUser(): Promise<string> {
    await StorageUtil.initPreferences();
    try {
      const val = await StorageUtil.prefs?.get(StorageUtil.CURRENT_USER_KEY, '');
      return val as string;
    } catch {
      return '';
    }
  }

  // ---------- 记住密码相关（原有逻辑基本不变） ----------
  static async saveUserInfo(account: string, password: string, isRemember: boolean): Promise<void> {
    await StorageUtil.initPreferences();
    try {
      await StorageUtil.prefs?.put(StorageUtil.USER_ACCOUNT_KEY, account);
      if (isRemember) {
        await StorageUtil.prefs?.put(StorageUtil.USER_PASSWORD_KEY, password);
      } else {
        await StorageUtil.prefs?.delete(StorageUtil.USER_PASSWORD_KEY);
      }
      await StorageUtil.prefs?.put(StorageUtil.IS_REMEMBER_KEY, isRemember);
      await StorageUtil.prefs?.flush();
    } catch (error) {
      console.error('保存用户信息失败:', error);
    }
  }

  static async getUserAccount(): Promise<string> {
    await StorageUtil.initPreferences();
    try {
      const val = await StorageUtil.prefs?.get(StorageUtil.USER_ACCOUNT_KEY, '');
      return val as string;
    } catch {
      return '';
    }
  }

  static async getUserPassword(): Promise<string> {
    await StorageUtil.initPreferences();
    try {
      const val = await StorageUtil.prefs?.get(StorageUtil.USER_PASSWORD_KEY, '');
      return val as string;
    } catch {
      return '';
    }
  }

  static async isRememberPassword(): Promise<boolean> {
    await StorageUtil.initPreferences();
    try {
      const val = await StorageUtil.prefs?.get(StorageUtil.IS_REMEMBER_KEY, false);
      return Boolean(val);
    } catch {
      return false;
    }
  }

  /** 清除所有用户信息（包含登录状态和记住密码数据） */
  static async clearAll(): Promise<void> {
    await StorageUtil.initPreferences();
    try {
      await StorageUtil.prefs?.clear();
      await StorageUtil.prefs?.flush();
    } catch (error) {
      console.error('清除所有数据失败:', error);
    }
  }
}