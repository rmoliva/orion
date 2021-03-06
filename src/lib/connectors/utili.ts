import Bluebird from 'bluebird';
import fs from 'fs';
import * as R from 'ramda';
import YAML from 'yaml';
import {
  IElementDefinition,
  IMeta,
  ISearchDefinition,
} from '../typings';

const fetchData: (data: any) => IElementDefinition = R.prop('data');
const fetchMeta: (data: any) => IMeta = R.prop('meta');

const filePath: (rootPath: string, locator: ISearchDefinition) => string =
(rootPath, locator) => `${rootPath}/${locator.locale}/${locator.ns}/${locator.type}.yml`;

const locatorUrl: (locator: ISearchDefinition) => string =
(locator) => `/${locator.locale}/${locator.ns}/${locator.type}.json`;

export {
  fetchData,
  fetchMeta,
  filePath,
  locatorUrl,
};
