/* tslint:disable no-unused-expression */
import { expect } from 'chai';
import * as R from 'ramda';
import testConnector from '../../src/lib/connectors/test';
import metaTestModule from '../../src/lib/meta/test';
import randomModule from '../../src/lib/random';
import testRepository from '../../src/lib/repository/memory';
import {
  IMetaFactory,
  IOptionalElement,
  IOptionalElementDefinition,
  ISearchDefinition,
} from '../../src/lib/typings';

describe('Random#random', () => {
  const meta: IMetaFactory = metaTestModule();

  const repository = testRepository({
    locale: 'es',
    elements: {},
  });

  const connector = testConnector({
    elements: {
      es: {
        ns1: {
          item1: {
            data: {
              text: 'ns1.item1',
            },
          },
          item2: {
            data: {
              text: 'ns1.item2',
            },
          },
        },
        ns2: {
          item1: {
            data: {
              text: 'ns2.item1',
            },
          },
          item2: {
            data: {
              text: 'ns2.item2',
            },
          },
        },
      },
      en: {},
    },
  });

  describe('with es locale', () => {
    const random = randomModule({
      connector,
      repository,
      meta,
    });

    describe('with one element search', () => {
      it('return the ns1:item2', (done) => {
        const searchDef: ISearchDefinition[] = [{
          locale: 'es',
          ns: 'ns1',
          type: 'item2',
        }];

        random.random(searchDef).then((data: IOptionalElement | IOptionalElementDefinition) => {
          expect(data).to.not.be.null;
          expect(data!.text).to.eql('ns1.item2');
          done();
        });
      });

      it('return the ns2:item1', (done) => {
        const searchDef: ISearchDefinition[] = [{
          locale: 'es',
          ns: 'ns2',
          type: 'item1',
        }];

        random.random(searchDef).then((data: IOptionalElement | IOptionalElementDefinition) => {
          expect(data).to.not.be.null;
          expect(data!.text).to.eql('ns2.item1');
          done();
        });
      });

      it('bad ns should return empty array', (done) => {
        const searchDef: ISearchDefinition[] = [{
          locale: 'es',
          ns: 'ns3',
          type: 'item1',
        }];

        random.random(searchDef).then((data: IOptionalElement | IOptionalElementDefinition) => {
          expect(data).to.be.null;
          done();
        });
      });

      it('bad item should return empty array', (done) => {
        const searchDef: ISearchDefinition[] = [{
          locale: 'es',
          ns: 'ns1',
          type: 'item4',
        }];

        random.random(searchDef).then((data: IOptionalElement | IOptionalElementDefinition) => {
          expect(data).to.be.null;
          done();
        });
      });
    });

    describe('with two element search', () => {
      it('return the ns1:item2 or ns2.item1', (done) => {
        const searchDef: ISearchDefinition[] = [{
          locale: 'es',
          ns: 'ns1',
          type: 'item2',
        }, {
          locale: 'es',
          ns: 'ns2',
          type: 'item1',
        }];

        random.random(searchDef).then((element: IOptionalElement | IOptionalElementDefinition) => {
          expect(element).to.not.be.null;
          expect(element!.text).to.oneOf(['ns1.item2', 'ns2.item1']);
          done();
        });
      });

      describe('with one unexistant element', () => {
        it('return the ns1:item2', (done) => {
          const searchDef: ISearchDefinition[] = [{
            locale: 'es',
            ns: 'ns1',
            type: 'item2',
          }, {
            locale: 'es',
            ns: 'ns1',
            type: 'item4',
          }];

          random.random(searchDef).then((element: IOptionalElement | IOptionalElementDefinition) => {
            expect(element).to.not.be.null;
            expect(element!.text).to.eql('ns1.item2');
            done();
          });
        });
      });
    });
  });
});
