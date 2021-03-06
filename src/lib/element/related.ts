import Bluebird from 'bluebird';
import * as R from 'ramda';
import {
  IElementDefinition,
  IOptionalElementDefinition,
  IRelatedElement,
  IRelatedElements,
  IRelatedModule,
  IWorldDefinition,
} from '../typings';
import { deepMerge } from '../utils';
import relatedDiceModule from './related/dice';
import relatedSearchModule from './related/search';
import { hasRelated, relatedHasDice } from './utils';

const relatedPromise: (world: IWorldDefinition, related: IRelatedElement, parent: IElementDefinition) =>
  Bluebird<IRelatedElement> =
(world, related, parent) => {
  if (relatedHasDice(related)) {
    return relatedDiceModule(world).get(related);
  }
  return relatedSearchModule(world).get(related, parent);
};

const processRelated: (world: IWorldDefinition, relatedMap: IRelatedElements, parent: IElementDefinition) =>
  Bluebird<IRelatedElements> =
(world, relatedMap, parent) => {
  return Bluebird.map(
    R.keys(relatedMap) as string[],
    (key: string) => {
      return relatedPromise(world, relatedMap[key], parent).then((related: IRelatedElement) => {
        return R.set(R.lensProp(key), related, relatedMap);
      });
    },
  ).then(deepMerge);
};

const getElement: (world: IWorldDefinition, element: IElementDefinition) => Bluebird<IElementDefinition> =
(world, element) => {
  return processRelated(world, element!.related!, element).then((related: IRelatedElements) => {
    return R.set(R.lensProp('related'), related, element);
  });
};

const relatedModule: IRelatedModule =
(world) => {
  const fetch: (element: IOptionalElementDefinition) => Bluebird<IOptionalElementDefinition> =
  (element) => {
    if (hasRelated(element)) {
      return getElement(world, element!);
    }
    return Bluebird.resolve(element);
  };

  return {
    fetch,
  };
};

export default relatedModule;
