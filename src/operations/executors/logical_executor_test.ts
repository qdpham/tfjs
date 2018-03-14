/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import * as dl from 'deeplearn';

import {Node} from '../index';

import {executeOp} from './logical_executor';
import {createTensorAttr} from './test_helper';

describe('logical', () => {
  let node: Node;
  const input1 = dl.scalar(1);
  const input2 = dl.scalar(2);

  beforeEach(() => {
    node = {
      name: 'test',
      op: '',
      category: 'logical',
      inputNames: ['input1', 'input2'],
      inputs: [],
      params: {a: createTensorAttr(0), b: createTensorAttr(1)},
      children: []
    };
  });

  describe('executeOp', () => {
    ['equal', 'greater', 'greaterEqual', 'less', 'lessEqual', 'logicalAnd',
     'logicalOr']
        .forEach(op => {
          it('should call dl.' + op, () => {
            const spy = spyOn(dl, op as 'equal');
            node.op = op;
            executeOp(node, {input1, input2});

            expect(spy).toHaveBeenCalledWith(input1, input2);
          });
        });
    describe('logicalNot', () => {
      it('should call dl.logicalNot', () => {
        spyOn(dl, 'logicalNot');
        node.op = 'logicalNot';
        executeOp(node, {input1});

        expect(dl.logicalNot).toHaveBeenCalledWith(input1);
      });
    });

    describe('where', () => {
      it('should call dl.where', () => {
        spyOn(dl, 'where');
        node.op = 'where';
        node.inputNames = ['input1', 'input2', 'input3'];
        node.params.condition = createTensorAttr(2);
        const input3 = dl.scalar(1);
        executeOp(node, {input1, input2, input3});

        expect(dl.where).toHaveBeenCalledWith(input3, input1, input2);
      });
    });
  });
});