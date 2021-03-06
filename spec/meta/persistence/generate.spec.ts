/* tslint:disable no-unused-expression */
import { expect } from 'chai';
import metaModule from '../../../src/lib/meta/persistence';
import {
  IMetaDefinition,
  ISearchDefinition,
} from '../../../src/lib/typings';

describe('MetaPersistence#generate', () => {
  const meta = metaModule({
    rootPath: './definitions',
    metaFilePath: 'meta.yml',
  });

  it('id 1 is for es/knave/pc', () => {
    meta.generate().then((definition: IMetaDefinition) => {
      expect(definition.ids['1']).to.not.be.undefined.and.not.be.null;

      const search: ISearchDefinition = definition.ids['1'];
      expect(search.locale).to.eql('es');
      expect(search.ns).to.eql('knave');
      expect(search.type).to.eql('pc');
    });
  });
});
