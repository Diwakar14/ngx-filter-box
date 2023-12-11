import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITableHeader } from './ITableHeader';

export interface ChangeKey {
  key: string;
}

export interface TabHeaders {
  activeTab: string;
  headers: ITableHeader[];
}

export interface ICacheData {
  showSpaceman?: boolean;
  totalItems?: number;
}

export interface ITabCacheData {
  activeTab: string;
  tabData: ICacheData;
}

export interface DateFilter {
  activeTab: string;
  filter: { startDate: string; endDate: string };
  currentDate: string;
}

export interface TabIcons {
  changedFilter: boolean;
  changedFilterWerte: boolean;
  changedVarianten: boolean;
  changedVariantenWerte: boolean;
  changedWerte: boolean;
  changedDomaene: boolean;
}

export interface ITransaction {
  numTransaktion: string;
  idOutput: string;
}

@Injectable({
  providedIn: 'root',
})
export class NgxFilterBoxService {
  private changeKey = new BehaviorSubject<ChangeKey>({ key: '' });
  private tabCache = new BehaviorSubject<ITabCacheData[]>([]);
  private headers = new BehaviorSubject<TabHeaders[]>([]);
  private dateFilter = new BehaviorSubject<DateFilter>({
    activeTab: '',
    currentDate: '',
    filter: { startDate: '', endDate: '' },
  });

  private transactionList = new BehaviorSubject<ITransaction[]>([]);

  private tabIcons = new BehaviorSubject<TabIcons>({
    changedFilter: false,
    changedFilterWerte: false,
    changedVarianten: false,
    changedVariantenWerte: false,
    changedWerte: false,
    changedDomaene: false,
  });

  private screenTitle = new BehaviorSubject<string>('');

  private isUserAuthorized: boolean = false;

  /**
   * Set Title of the Screen
   */
  setTitle(title: string) {
    this.screenTitle.next(title);
  }

  /**
   * Get Title of the Screen
   */
  get getTitle$() {
    return this.screenTitle;
  }

  /**
   * Set Update or Added Key
   * @param changeKey
   */
  setChangeKey(changeKey: ChangeKey) {
    this.changeKey.next(changeKey);
  }
  get getChangeKey() {
    return this.changeKey.value;
  }

  /**
   * Set Header and Filter data
   */
  setHeader(header: TabHeaders) {
    let tabHeaderIndex = this.headers.value.findIndex(
      (a) => a.activeTab === header.activeTab
    );
    if (tabHeaderIndex > -1) {
      this.headers.value[tabHeaderIndex] = header;
    } else {
      this.headers.value.push(header);
    }
    this.headers.next(this.headers.value);
  }

  /**
   * Header Observable
   */
  get Headers$() {
    return this.headers;
  }

  /**
   * Get Headers
   */
  getAllHeaders() {
    return this.headers.getValue();
  }

  /**
   * Get Headers
   */
  setAllHeaders(headers: TabHeaders[]) {
    return this.headers.next(headers);
  }

  /**
   * Get Cached Headers
   * @param activeTab
   * @returns
   */
  getHeaders(activeTab: string) {
    let tabHeader = this.headers.value.find((a) => a.activeTab === activeTab);
    if (tabHeader) return tabHeader;
    return null;
  }

  /**
   * Set Date Filter
   */
  setDateFilter(filter: DateFilter) {
    this.dateFilter.next(filter);
  }

  get getDateFilter() {
    return this.dateFilter.value;
  }

  /**
   * set Tab Cache
   */
  setTabCache(tabData: ITabCacheData) {
    let tabHeaderIndex = this.tabCache.value.findIndex(
      (a) => a.activeTab === tabData.activeTab
    );
    if (tabHeaderIndex > -1) {
      this.tabCache.value[tabHeaderIndex] = tabData;
    } else {
      this.tabCache.value.push(tabData);
    }
    this.tabCache.next(this.tabCache.value);
  }
  /**
   * Get Tab cache
   */
  getTabCache(activeTab: string) {
    let tabCache = this.tabCache.value.find((a) => a.activeTab === activeTab);
    if (tabCache) return tabCache;
    return null;
  }
}
