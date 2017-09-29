export default class FxService{
  getRootServices(){
    return [
      new RootService("ServiceOne",["ActionOneOne","ActionOneTwo"]),
      new RootService("ServiceTwo",["ActionTwoOne","ActionTwoTwo"]),
      new RootService("ServiceThree",["ActionThreeOne"])
    ]
  }

  invokeRootAction(actionName: string){
      if(actionName === "ActionOneTwo")
        return;
      return new EntityModel(actionName + 'Entity',"A " + actionName)
  }
}

export class RootService{
  constructor(
    public name: string,
    public actions: string[],
  ){}
}

export class EntityModel{
  static instanceCount =0;
  constructor(public name: string, public title: string){
    this.title += '#' + EntityModel.instanceCount;
    EntityModel.instanceCount++;
  }
}