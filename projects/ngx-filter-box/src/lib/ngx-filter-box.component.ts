import {
  AfterViewInit,
  ChangeDetectorRef,
  Injectable,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  Component,
} from '@angular/core';
import { IFilter } from './ITableHeader';
import { TableFilter } from './TableFilter';

@Component({
  selector: 'lib-ngx-filter-box',
  template: `
    <div class="ace-filter-box">
      <div class="type-date-input" *ngIf="filter.type != 'date'">
        <input
          type="text"
          class="ib_input-text"
          [ngClass]="{ 'ib_input-text--small ib_input-text--small-font': mini }"
          name="filterSearchInput"
          [ngModel]="searchInput"
          (ngModelChange)="searchFilter($event)"
          (focus)="show()"
          [value]="searchInput"
          autocomplete="off"
          [placeholder]="filter.name"
          value=""
        />
      </div>
      <div class="type-date-input ib_p-relative" *ngIf="filter.type == 'date'">
        <input
          type="text"
          class="ib_input-text"
          [ngClass]="{ 'ib_input-text--small ib_input-text--small-font': mini }"
          name="filterSearchInput"
          [(ngModel)]="inputDate"
          (focus)="show()"
          [value]="inputDate"
          autocomplete="off"
          [placeholder]="filter.name"
        />
        <div class="ace-picker" (click)="show()">
          <svg class="ib_icon" height="20" width="20">
            <use
              href="../../../../../assets/images/icons.svg#calendar-sm"
            ></use>
          </svg>
        </div>
      </div>

      <div
        class="ace-filter-popover"
        [class.ace-filter-popover--right]="postitionRight"
        *ngIf="filter.open"
        @SlideDown
      >
        <ul class="ace-filter-list">
          <li>
            <input
              class="ib_checkbox__input ib_mr-1"
              [(ngModel)]="selectAll"
              (ngModelChange)="checkAll($event)"
              type="checkbox"
              [value]="selectAll"
              id="filter"
            />
            <label for="filter"> Alle</label>
          </li>
          <ng-container *ngFor="let filter of filteredData; index as i">
            <li *ngIf="filter.val != null && filter.val != ''">
              <input
                class="ib_checkbox__input ib_mr-1"
                [(ngModel)]="filter.checked"
                (ngModelChange)="selectFilter(filter.val)"
                type="checkbox"
                id="filter-{{ i }}"
              />
              <label for="filter-{{ i }}"> {{ filter.val }}</label>
            </li>
          </ng-container>
        </ul>
        <div class="type-date" *ngIf="filter.type == 'date'">
          <!-- <mat-calendar
            [(selected)]="selectedDate"
            (selectedChange)="onDateSelect($event)"
          ></mat-calendar> -->
        </div>
        <div class="ace-filter-action">
          <button
            type="button"
            (click)="removeFilter()"
            class="ib_btn ib_btn--secondary ib_btn--tiny"
          >
            Rücksetzen
          </button>
          <button
            type="button"
            (click)="applyFilter()"
            class="ib_btn ib_btn--primary ib_btn--tiny"
          >
            Ok
          </button>
        </div>
      </div>
    </div>

    <div class="ace-backdrop" *ngIf="filter.open" (click)="close()"></div>
  `,
  styles: [
    `
      .ace-filter-box {
        position: relative;
        background-color: white;
        .ib_input-text {
          position: relative;
          z-index: 5;
        }
      }
      .ace-filter-popover {
        position: absolute;
        left: 0;
        min-width: 280px;
        background-color: #fff;
        box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.1);
        z-index: 10;
        width: 100%;

        .ace-filter-action {
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }

      .ace-filter-popover--right {
        right: 0 !important;
        left: unset;
      }

      .ace-filter-list {
        overflow-y: auto;
        max-height: 300px;
        margin: 0;
        padding: 0;
        list-style: none;
        padding: 0.5rem;
        border-radius: 4px;

        li:hover {
          cursor: pointer;
        }
      }

      .ace-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        z-index: 2;
      }

      .ace-picker {
        position: absolute;
        right: 1rem;
        top: 0.5rem;
        z-index: 10;
      }
    `,
  ],
})
export class NgxFilterBoxComponent implements OnInit, AfterViewInit {
  /**
   * Filter data for a specific column
   */
  @Input() filter: IFilter | any = {
    filterListData: [],
    defaultFilters: [],
    active: false,
    open: false,
    filteredData: [],
  };

  /**
   * Size
   */
  @Input()
  mini: boolean = false;

  /**
   * Popeover
   */
  @Input()
  postitionRight: boolean = false;

  /**
   * Output event for open and close of the filter box
   */
  @Output() toggleFilter = new EventEmitter();

  /**
   * Output the selected filters
   */
  @Output() onFilter = new EventEmitter();

  /**
   * Filter list after appling search
   */
  filteredData: any[] = [];

  /**
   * boolean to show and hide the filter box
   */
  showFilters: boolean = false;

  /**
   * Variable to bind the search input
   */
  searchInput: string = '';

  /**
   * Set of Selected filters for total filters
   */
  selectedFilter = new Set<string>();

  /**
   * Selected date
   */
  selectedDate!: Date;

  /**
   * Selected date
   */
  inputDate!: string;

  /**
   * Boolean to select all the filters
   */
  selectAll: boolean = false;

  /**
   * timeout
   */
  timer: any;

  /**
   *
   */
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.filteredData = this.filter.filterListData;

    /**
     * Initialize selected filter if any
     */
    if (this.filter.filteredData?.length > 0) {
      this.filter.filteredData.forEach((selected: string) => {
        this.selectedFilter.add(selected);
      });
    }
  }

  ngAfterViewInit(): void {
    /**
     * Initialize and apply defualt filters
     */
    if (this.filter.defaultFilters?.length > 0) {
      this.filter.filterListData.forEach((f: any) => {
        if (this.filter.defaultFilters?.includes(f.val?.toLocaleLowerCase())) {
          f.checked = false;
        } else {
          this.selectedFilter.add(f.val?.toLocaleLowerCase());
          f.checked = true;
        }
      });

      /**
       * Add blank when nothing other than given default filter
       */
      if (this.selectedFilter.size == 0) {
        this.selectedFilter.add('');
      }

      if (this.selectedFilter.size > 0) {
        setTimeout(() => {
          this.applyFilter();
        });
      }
    }
    this.selectAll = this.isAllChecked();
  }
  /**
   * Reset input date
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['filter'].currentValue['active'] === false &&
      this.filter.type === 'date'
    ) {
      this.inputDate = '';
    }
  }

  /**
   * Search filters
   * @param search Search key from input box
   */
  searchFilter(search: string) {
    search = search + '';
    if (typeof search === 'string') {
      this.filteredData = this.filter.filterListData.filter((e: any) =>
        e.val?.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      );
    }
    this.selectAll = this.isAllChecked();
  }

  /**
   * Show filter box
   */
  show() {
    this.toggleFilter.emit('open');
  }

  /**
   * Select all the filters for a specific column
   * @param selected selected filter
   */
  checkAll(selected: boolean) {
    if (selected) {
      this.filteredData.forEach((f) => (f.checked = true));
      this.filteredData.forEach((f) =>
        this.selectedFilter.add(f.val?.toLocaleLowerCase())
      );
    } else {
      this.filteredData.forEach((f) => (f.checked = false));
      this.selectedFilter.clear();
    }
  }

  /**
   * Check if all the filters are selected
   * @returns
   */
  isAllChecked() {
    return this.filteredData.every((f) => f.checked === true);
  }

  /**
   * Event fired where we select a filter.
   * @param filter Filter key
   */
  selectFilter(filter: string) {
    filter = filter.toString().toLocaleLowerCase();
    if (this.selectedFilter.has(filter)) {
      this.selectedFilter.delete(filter);
    } else {
      this.selectedFilter.add(filter);
    }

    this.selectAll = this.isAllChecked();
  }

  /**
   * Selected dtae
   */
  onDateSelect(event: any) {
    // this.selectedFilter.clear();
    // let date = DateTime.fromJSDate(new Date(event)).toFormat(
    //   this.filter.dateFormat
    // );
    // this.selectedFilter.add(date);
    // this.inputDate = date;
  }

  /**
   * Applies the selected filters, emits event so that parent can filter the main array
   * @param context
   */
  applyFilter(context?: string) {
    /**
     * For Date filter only
     */
    if (
      this.inputDate != '' &&
      this.filter.type == 'date' &&
      context != 'remove'
    ) {
      this.selectedFilter.clear();
      this.selectedFilter.add(this.inputDate);
    }

    let obj = {
      selectedFilter: Array.from(this.selectedFilter),
    };

    this.onFilter.emit(obj);
    this.close(context);
  }

  /**
   * Removes filter from a specific column
   */
  removeFilter() {
    this.selectedFilter.clear();
    this.filteredData.forEach((f) => (f.checked = false));
    this.applyFilter('remove');
    this.searchInput = '';
    this.inputDate = '';
    this.selectedDate = new Date();
  }

  /**
   * Close the filter box
   * @param context
   */
  close(context?: string) {
    this.toggleFilter.emit(context);
  }
}
