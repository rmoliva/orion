
import Bluebird from 'bluebird';

type uuid = string;

enum ERandomOption {
  definition = 'definition', // Generate a new Element
  all = 'all', // Choose an existing Element or generate a new one
  existing = 'existing', // Choose only existing Element
}

interface ISearchDefinition {
  locale: string;
  ns: string;
  type: string;
  random?: ERandomOption;
}

interface IRelatedElement {
  text?: string;
  search?: ISearchDefinition[];
  dice?: string; // Dice result is given in results also
  results?: Array<IElementDefinition | IElement>; // Here is save the result
  count?: number | string; // If string is passed it is taken as a dice expression
}

interface IRelatedElements {
  [details: string]: IRelatedElement;
}

type IDiceDefinition = string;

interface IElementDefinition {
  text: string;
  parent?: IElementDefinition;
  options?: IElementDefinition[];
  related?: IRelatedElements;
  dice?: IDiceDefinition;
  weight?: number; // Number of appearances of this option to randomly choose (defaults to 1)
}

type IOptionalElementDefinition = IElementDefinition | null | undefined;

type IPromisfyElementDefinition = (element: IOptionalElementDefinition) => Bluebird<IOptionalElementDefinition>;

interface IElement {
  ns: string;
  type: string;
  guid: uuid;
  text: string;
  parent?: IElement;
  related?: {
    [key: string]: string; // Related to a IElement.GUID
  };
}

interface IElementFormatted {
  title?: string;
  text?: string;
  children?: IElementFormatted[];
}

type IOptionalElement = IElement | null | undefined;

type ISearchResult = Array<IElement | IElementDefinition>;

interface IMeta {
  system: string;
  id?: string;
  locator?: ISearchDefinition;
}

interface IMetaDefinition {
  ids: {
    [id: string]: ISearchDefinition;
  };
}

interface ILocalConnectorOptions {
  rootPath: string;
}

interface IRemoteConnectorOptions {
  debug?: boolean;
  baseURL: string;
}

interface ITestConnectorOptions {
  elements: {
    [locale: string]: {
      [ns: string]: {
        [type: string]: {
          data: IElementDefinition;
          meta?: IMeta;
        };
      };
    };
  };
}

interface IRepositoryOptions {
  locale: string;
  elements: {
    [locale: string]: IElement[];
  };
}

interface IMetaOptions {
  rootPath: string;
  metaFilePath: string;
}

interface IConnectorFactory {
  get: (locator: ISearchDefinition) => Bluebird<IOptionalElementDefinition>;
  meta: (locator: ISearchDefinition) => Bluebird<IMeta>;
}

interface IRepositoryFactory {
  getByGuid: (guid: uuid) => Bluebird<IOptionalElement>;
  search: (search: ISearchDefinition) => Bluebird<IElement[]>;
}

interface IMetaFactory {
  getById: (id: string) => Bluebird<ISearchDefinition[]>;
}

interface IWorldFactory {
  get: (search: IRelatedElement) => Bluebird<IWorldElement[]>;
  getById: (id: string) => Bluebird<IWorldElement[]>;
}

interface IElementFactory {
  get: (element: IOptionalElementDefinition | IOptionalElement) => Bluebird<IOptionalElementDefinition>;
}

interface IWorldDefinition {
  connector: IConnectorFactory;
  repository: IRepositoryFactory;
  meta: IMetaFactory;
}

interface IWorldElement {
  meta?: IMetaDefinition;
  data?: IElementDefinition[];
  format: IElementFormatted | null;
}

type IWorldModule = (world: IWorldDefinition) => IWorldFactory;

type IElementModule = (world: IWorldDefinition) => IElementFactory;

type IRelatedSearchModule = (world: IWorldDefinition) => {
  get: (related: IRelatedElement, parent: IElementDefinition) => Bluebird<IRelatedElement>;
};

type IRelatedDiceModule = (world: IWorldDefinition) => {
  get: (related: IRelatedElement) => Bluebird<IRelatedElement>;
};

type IOptionsModule = (world: IWorldDefinition) => {
  random: IPromisfyElementDefinition;
};

type IRelatedModule = (world: IWorldDefinition) => {
  fetch: IPromisfyElementDefinition;
};

type IElementDiceModule = (world: IWorldDefinition) => {
  roll: IPromisfyElementDefinition;
};

type ISearchModule = (world: IWorldDefinition) => {
  find: (search: ISearchDefinition[]) => Bluebird<ISearchResult>;
};

type ISearchByTypeModule = (world: IWorldDefinition) => {
  find: (search: ISearchDefinition) => Bluebird<ISearchResult>;
};

type IDistributeModule = (options: IElementDefinition[]) => {
  get: () => IElementDefinition[];
};

type IRandomModule = (world: IWorldDefinition) => {
  random: (search: ISearchDefinition[]) => Bluebird<IOptionalElement | IOptionalElementDefinition>;
};

type ICliModule = (args: string[]) => {
  get: () => Bluebird<IWorldElement[]>;
};

type IFolderModule = (rootPath: string) => {
  folders: () => Bluebird<string[]>;
};

type ICliOutModule = (logger: any) => {
  output: (elements: IElementFormatted[]) => void;
};

type IDiceModule = (diceDef: string) => {
  roll: () => number | null;
  rollElement: () => Bluebird<IOptionalElementDefinition>;
};

type ICounterModule = (countDef: string | number | null | undefined) => {
  get: () => number;
};

type IMetaTestModule = () => IMetaFactory;

type IMetaModule = (options: IMetaOptions) => IMetaFactory;

type IMetaPersistenceModule = (options: IMetaOptions) => {
  generate: () => Bluebird<IMetaDefinition>;
  write: () => Bluebird<IMetaDefinition>;
  read: () => Bluebird<IMetaDefinition>;
};

type IMetaIdModule = (options: IMetaDefinition) => {
  search: (id: string) => ISearchDefinition[];
};

/////////////////////////////////////////////////////////

interface IAliasDefinition {
  [details: string]: string[];
}

interface ILocalizeOptions {
  locale?: string;
  debug?: boolean;
  translations: {};
}

interface IPersistanceSave {
  element: IElement;
  existing: IElement[];
}

export {
  uuid,
  IOptionalElementDefinition,
  IConnectorFactory,
  IRepositoryFactory,
  ILocalConnectorOptions,
  IRemoteConnectorOptions,
  ITestConnectorOptions,
  IRepositoryOptions,
  IMetaOptions,
  IMeta,
  IMetaDefinition,
  IWorldElement,
  IElementModule,
  IRelatedSearchModule,
  IRelatedDiceModule,
  IOptionsModule,
  IRelatedModule,
  IElementDiceModule,
  IDiceModule,
  ISearchModule,
  ISearchByTypeModule,
  IRandomModule,
  IWorldModule,
  IWorldFactory,
  IElementFactory,
  ICliModule,
  IFolderModule,
  IElementFormatted,
  ICliOutModule,
  ICounterModule,
  IDistributeModule,
  IMetaModule,
  IMetaTestModule,
  IMetaPersistenceModule,
  IMetaIdModule,
  IMetaFactory,
  ERandomOption, //
  IElementDefinition,
  IDiceDefinition,
  IWorldDefinition,
  ISearchDefinition,
  ISearchResult,
  IRelatedElement,
  IRelatedElements,
  IElement,
  IOptionalElement,
  IAliasDefinition,
  ILocalizeOptions,
  IPersistanceSave,
};
