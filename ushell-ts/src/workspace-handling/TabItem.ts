export class TabItem {
  id: string = "";
  tag: any | undefined;
  title: string = "";
  canClose: boolean = true;
  renderMethod?: () => JSX.Element;
}