import { DropdownOptions } from './DropdownOptions';

export interface IList {
  /**
   * value
   */
  val: string;
  /**
   * Is checked
   */
  checked: boolean;
  /**
   * Display text
   */
  text?: string;
}
export interface IFilter {
  /**
   * List of all the filters for a specific column
   */
  filterListData: Array<IList>;

  /**
   * Whether the filter is applied on a specific column
   */
  active: boolean;

  /**
   * Type of filter, Normal | Date
   */
  type?: string;

  /**
   * Format of the date, if filter type is date
   */
  dateFormat?: string;

  /**
   * Is the filter box open
   */
  open: boolean;

  /**
   * Name of the filter.
   */
  name: string;

  /**
   * This is a Negation Filters applied initially. Whatever provided in this array is not applied, rest is applied.
   * Provide filters in lowercase.
   * Provide Specific names of the filter.
   */
  defaultFilters?: Array<string>;

  /**
   * Selected Filter
   */
  filteredData: Array<string>;
}

export interface GridData {
  /**
   * Type of the control required when edit
   */
  inputType?: string;

  /**
   * Options for the dropdown, if inputType is Dropdown
   */
  dropdownOptions?: DropdownOptions[];

  /**
   * Check for any column to be unique
   */
  uniqueKey?: boolean;

  /**
   * Default value for the control.
   */
  defaultValue?: string;

  /**
   * Required Validation
   */
  required?: boolean;

  /**
   * Disables control, but if we have to take the value, then we have to manually add that to the required body.
   * As it won't be picked up by default.
   */
  disabled?: boolean;

  /**
   * Disable in edit
   */
  disableOnEdit?: boolean;

  /**
   * Disable in edit
   */
  disableCondition?: string;

  /**
   * Max Length of input
   */
  maxLength?: number | any;

  /**
   * Extra
   */
  extra?: any;
}
export interface ITableHeader {
  /**
   * Name of the header
   */
  name: string;

  /**
   * Key of the column
   */
  key: string;

  /**
   * Class for each column
   */
  cssClass?: string;

  /**
   * Whether filter is required
   */
  filterable: boolean;

  /**
   * Sorting in asc|desc
   */
  sortable: string;

  /**
   * Filter data
   */
  filter: IFilter;

  /**
   * Table Grid data
   */
  gridData?: GridData;
}
