import NoteData from "../viewmodel/NoteData"
import NotePreferenceModel from "../model/NotePreferenceModel"

//编辑note的页面
@Component
export default struct NoteItemEdit {
  @StorageLink('globalBgColor') bgColor: string = '#FFFFFF';
  @Consume("Notes") notes: Array<NoteData>
  @Consume("NotesPageStack") notesPageStack: NavPathStack;
  @Prop note: NoteData;//单向接收note的值
  //存储修改后的数据
  @State m_title: string = "";
  @State m_content: string = "";

  aboutToAppear(): void {
    this.m_title = this.note.title;
    this.m_content = this.note.content;
  }

  //在自定义组件即将析构销毁时执行
  async aboutToDisappear(): Promise<void> {
    if (this.m_title != this.note.title || this.m_content != this.note.content) {//检查是否修改
      NotePreferenceModel.delete(this.note.title);//把原来的删了
      if (this.note.title == "" && this.note.content == "") {//如果是空的就只设置时间
        this.note.createdAt = (new Date()).toString();
      }
      await NotePreferenceModel.put({title: this.m_title, content: this.m_content, createdAt: this.note.createdAt, updatedAt: (new Date()).toString()})
      //获取后重新排序
      this.notes = await NotePreferenceModel.getAll();
      this.notes.sort((a, b) => (new Date(b.updatedAt)).getTime() - (new Date(a.updatedAt)).getTime())
      //遍历输出
      this.notes.forEach((item) => {
        console.log(item.title, item.content, item.createdAt, item.updatedAt)
      })
    }
  }

  build() {
    NavDestination() {
      Column() {
        Row() {
          Text($r("app.string.create_at"))
            .fontColor(this.getTextColor())
          Text((new Date(this.note.createdAt)).toLocaleString())
            .fontColor(this.getTextColor())
        }
        .height("3%")
        .margin({top:40})
        Row() {
          Text($r("app.string.updated_at"))
            .fontColor(this.getTextColor())
          Text((new Date(this.note.updatedAt)).toLocaleString())
            .fontColor(this.getTextColor())
        }
        .height("3%")
        .margin("1%")
        TextInput({placeholder: $r("app.string.title_input_tip"), text: this.m_title})
          .onChange((v: string) => {
            this.m_title = v;
          })
          .fontColor(this.getTextColor())
          .placeholderColor(this.getTextColor())
          .margin("2%")
          .height("6%")
        TextArea({placeholder: $r("app.string.content_input_tip"), text: this.m_content})
          .onChange((v: string) => {
            this.m_content = v;
          })
          .fontColor(this.getTextColor())
          .placeholderColor(this.getTextColor())
          .height("80%")
      }
      .backgroundColor(this.bgColor)
      .width("100%")
      .height("100%")

    }
    .hideTitleBar(true)

  }
  private getTextColor(): Color {
    return this.bgColor === '#333333' ? Color.White : Color.Black;
  }
}