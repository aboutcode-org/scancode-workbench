import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import { IFloatingFilterParams, TextFilterModel } from 'ag-grid-community';
import { DEFAULT_EMPTY_VALUES } from './columnGroups';

export interface CustomParams extends IFloatingFilterParams {
  suppressFilterButton: boolean;
  color: string;
}

function parseProbableStringifiedArray(str: string){
  try {
    const result = JSON.parse(str);
    if(Array.isArray(result)){
      const parseableResultArray = result as string[][];
      return parseableResultArray.map(subEntry => subEntry.join(',')).join(',');
    }
    return str;
  } catch (e) {
    return str;
  }
}

const CustomFilterComponent = forwardRef((props: CustomParams, ref) => {
  const { parentFilterInstance, filterParams } = props;

  const optionValues: string[] = filterParams.colDef.filterParams?.options || [];

  const selectRef = useRef<HTMLSelectElement | null>(null);

  // expose AG Grid Filter Lifecycle callbacks
  useImperativeHandle(ref, () => {
    return {
      onParentModelChanged(parentModel: TextFilterModel){
        if(!selectRef.current)
          return;
          
        // When the filter is empty we will receive a null value here
        if (!parentModel) {
          selectRef.current.value = optionValues[0];
        } else {
          selectRef.current.value = parentModel.filter;
        }
      }
    }
  });

  function selectionChanged(value: string){
    if (value === optionValues[0]) {
      parentFilterInstance(instance => {
        instance.onFloatingFilterChanged('equals', null);
      });
      return;
    }
    parentFilterInstance(instance => {
      instance.onFloatingFilterChanged('equals', value);
    });
  }

  return (
    <select
      ref={selectRef}
      className='filterComponent'
      defaultValue={optionValues[0]}
      onChange={e => selectionChanged(e.target.value)}
    >
      {
        optionValues.map((optionValue, idx) => {
          const parsedOptionValue = parseProbableStringifiedArray(optionValue);
          return (
            <option value={optionValue} key={optionValue+idx}>
              {
                DEFAULT_EMPTY_VALUES.has(optionValue) ? "All"
                : parsedOptionValue
              }
            </option>
          )
        })
      }
    </select>
  )
});

export default CustomFilterComponent;