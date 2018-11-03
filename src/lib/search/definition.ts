import Bluebird from 'bluebird';
import * as R from 'ramda';
import {
  ERandomOption,
  IOptionalElementDefinition,
  ISearchByTypeModule,
  ISearchDefinition,
  ISearchResult,
} from '../typings';
import {
  compactArray,
} from '../utils';
import {
  isSearchType, isSearchTypeOrAll,
} from './util';

const searchDefinitionModule: ISearchByTypeModule =
(world) => {
  const doSearch: (search: ISearchDefinition) => Bluebird<ISearchResult> =
  (search) => {
    return world.connector.get({
      locale: world.locale,
      ns: search.ns,
      type: search.type,
    }).then((element: IOptionalElementDefinition) => {
      // Transform to array
      return compactArray([element]);
    });
  };

  const find: (search: ISearchDefinition) => Bluebird<ISearchResult> =
  (search) => {
    if (isSearchTypeOrAll(search, ERandomOption.definition)) {
      return doSearch(search);
    }
    return Bluebird.resolve([]);
  };

  return {
    find,
  };
};

export default searchDefinitionModule;
