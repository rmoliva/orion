import Bluebird from 'bluebird';
import YAML from 'yaml';
import { readFile } from '../file';
import {
  IConnectorFactory,
  IElementDefinition,
  ILocalConnectorOptions,
  IMeta,
  IOptionalElementDefinition,
  ISearchDefinition,
} from '../typings';
import { dg } from '../utils';
import {
  fetchData,
  fetchMeta,
  filePath,
} from './utili';

const getResult: (rootPath: string, locator: ISearchDefinition) => Bluebird<IOptionalElementDefinition> =
(rootPath, locator) => readFile(filePath(rootPath, locator)).then(YAML.parse).catch((error: any) => {
  dg(error.toString(), locator);
});

const localConnector: (options: ILocalConnectorOptions) => IConnectorFactory =
(options) => {
  const get: (locator: ISearchDefinition) => Bluebird<IOptionalElementDefinition> =
  (locator) => getResult(options.rootPath, locator).then(fetchData);

  const meta: (locator: ISearchDefinition) => Bluebird<IMeta> =
  (locator) => getResult(options.rootPath, locator).then(fetchMeta);

  return {
    get,
    meta,
  };
};

export default localConnector;
