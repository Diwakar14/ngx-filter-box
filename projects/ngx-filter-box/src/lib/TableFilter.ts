import { ITableFilter } from './ITableFilter';
import { ITableHeader } from './ITableHeader';
import { DateTime } from 'luxon';
import { NgxFilterBoxService } from './ngx-filter-box.service';

/**
 * This class hanldes column filter for a table.
 * It has functions and variable to implement column filter to any table
 */
export class TableFilter implements ITableFilter {
  /**
   * Array after applied filters
   */
  sortedDataRow: any[];

  /**
   * Original Array to reset the filter on table
   */
  dataRow: any[];

  /**
   * Header array of the columns of the table
   */
  headers: ITableHeader[];

  /**
   * Boolean to enable filter caching
   */
  protected cacheFilter: boolean = false;
  /**
   * Active tab to cache filter
   */
  protected activeTabName: string = '';

  constructor(public readonly dataStore?: NgxFilterBoxService) {
    this.sortedDataRow = [];
    this.dataRow = [];
    this.headers = [];
  }

  /**
   * Extract distinct filters form the array of objects
   * @param sortedDataRow Array to extract filters from.
   * @returns Map of Set
   */
  extractFilters(
    sortedDataRow: any[],
    headers: ITableHeader[]
  ): Map<string, Set<string>> {
    let h = new Map<string, Set<string>>();
    for (const ele of sortedDataRow) {
      delete ele.expanded;
      delete ele.selected;

      headers
        .filter((f) => f.filterable)
        .forEach((c: ITableHeader) => {
          let sKey = TableFilter.getKey(c.key, ele);
          const filterType = c.filter?.type;

          /**
           * Covert to sKey to date if type is date
           */
          const dateFormat = c.filter?.dateFormat;
          if (filterType == 'date') {
            sKey = DateTime.fromJSDate(new Date(sKey)).toFormat(
              dateFormat as string
            );
          }

          if (h.has(c.key)) {
            h.set(c.key, h.get(c.key)?.add(sKey) as Set<string>);
          } else {
            h.set(c.key, new Set().add(sKey) as Set<string>);
          }
        });
    }
    return h;
  }

  /**
   * Maps extracted filters to the header array of each column.
   * @param headers Headers arrya
   * @param h Map of filters
   * @returns List of headers containing the filter data.
   */
  mapExtractedFiltersToHeaders(
    headers: ITableHeader[],
    h: Map<string, Set<string>>
  ): ITableHeader[] {
    return headers.map((i: ITableHeader, index: number) => {
      let filter: any = [];
      if (i.key != '') {
        if (i.filter.filteredData.length === 0) {
          if (h.has(i.key))
            filter = i.filterable
              ? Array.from(h.get(i.key) as Set<string>).sort()
              : [];
        } else {
          return i; // Return the same object, without recalculating the filters
        }
      }

      return {
        ...i,
        filter: {
          name: i.name,
          filterListData: filter.map((f: string) => ({
            val: f == null ? null : f.toString()?.trim(),
            checked: false,
          })),
          active: false,
          open: false,
          defaultFilters: i.filter?.defaultFilters,
          type: i.filter?.type,
          dateFormat: i.filter?.dateFormat,
          filteredData: new Array<string>(),
        },
      };
    });
  }

  /**
   * Extracts and map the filters to the header of the table
   * @param sortedDataRow
   * @param headers
   * @returns
   */
  extractFilterAndMapToHeader(
    sortedDataRow: any[],
    headers: ITableHeader[]
  ): ITableHeader[] {
    let h = this.extractFilters(sortedDataRow, headers);
    return this.mapExtractedFiltersToHeaders(headers, h);
  }

  /**
   * Applies column filter to all the columns of the table.
   * @param sortedDataRow
   * @param headers
   * @returns
   */
  applyFilter(sortedDataRow: any[], headers: ITableHeader[]) {
    for (const header of headers) {
      const key = header.key;
      const filter = header.filter.filteredData;
      const filterType = header.filter.type;
      const dateFormat = header.filter.dateFormat;

      if (filter.length > 0) {
        sortedDataRow = sortedDataRow.filter((trans: any) => {
          let sKey = TableFilter.getKey(key, trans);

          /**
           * Covert to sKey to date if type is date
           */
          if (filterType == 'date') {
            sKey = DateTime.fromJSDate(new Date(sKey)).toFormat(
              dateFormat as string
            );
          }
          if (sKey != ' ' || sKey != null) {
            return filter.includes(sKey?.toString().toLocaleLowerCase());
          }
          return false;
        });
      }
    }
    return sortedDataRow;
  }

  /**
   * Retrieves values from a nested object
   * @param keys Key to find
   * @param ele row of Object
   * @returns
   */
  static getKey(keys: string, ele: any) {
    let keyArray = keys.split(',');
    let s = '';
    if (keyArray.length > 0) {
      let item = ele;
      for (const key of keyArray) {
        item = item[key];

        if (item == null || item == undefined) {
          break;
        }
      }
      s = item;

      if (typeof s === 'string') {
        s = s.trim();
      }
    }
    return s;
  }

  /**
   * Initialize filters from the cache
   * @param tabName Tab name
   */
  initFilterFromCache(tabName: string) {
    if (this.cacheFilter) {
      let headers: ITableHeader[] | any =
        this.dataStore?.getHeaders(tabName)?.headers;
      if (headers?.length > 0) {
        this.sortedDataRow = this.applyFilter(this.sortedDataRow, headers);
        this.headers = headers;
        return true;
      }
    }
    return false;
  }

  /**
   * Function to handle filter when apply filter is pressed.
   * @param filter List of selected filters
   * @param index Index of the columns
   */
  handleApplyFilter(filter: { selectedFilter: string[] }, index: number) {
    this.headers[index].filter.filteredData = filter.selectedFilter;
    this.sortedDataRow = this.dataRow;

    this.sortedDataRow = this.applyFilter(this.sortedDataRow, this.headers);
    this.headers[index].filter.open = false;
    this.headers[index].filter.active = true;
    this.headers = this.extractFilterAndMapToHeader(
      this.sortedDataRow,
      this.headers
    );
    if (this.cacheFilter) {
      this.cacheActiveFilter(this.headers);
    }
  }

  protected cacheActiveFilter(header: ITableHeader[]) {
    if (this.activeTabName != '')
      this.dataStore?.setHeader({
        activeTab: this.activeTabName,
        headers: header,
      });
  }

  /**
   * Open and close the filter box
   * @param context Open or remove
   * @param index index of the columns
   */
  handleToggleFilter(context: string, index: number) {
    if (context == 'open') {
      this.headers.forEach((h: any) => (h.filter.open = false));
      this.headers[index].filter.open = true;
    } else {
      this.headers[index].filter.open = false;
      if (context == 'remove') {
        this.headers[index].filter.active = false;
      }
    }

    // Reset datastore
    this.dataStore?.setHeader({
      activeTab: this.activeTabName,
      headers: this.headers,
    });
  }

  /**
   * Remove/invalidate cache stored previously
   */
  removeFilterCache() {
    this.dataStore?.setHeader({ activeTab: this.activeTabName, headers: [] });
  }

  /**
   * Clears all the filters
   */
  clearFilter() {
    this.sortedDataRow = this.dataRow;
    this.headers.forEach((h) => (h.filter.filteredData = []));
    this.headers = this.extractFilterAndMapToHeader(
      this.sortedDataRow,
      this.headers
    );

    // Reset datastore
    this.dataStore?.setHeader({
      activeTab: this.activeTabName,
      headers: this.headers,
    });
  }
}
