import {Component, OnDestroy, OnInit} from '@angular/core';
import {QueryParamModel} from '../../shared/model/Response/query-param.model';
import {PanelModel} from '../../shared/model/sms/panel.model';
import {Router} from '@angular/router';
import {SmsService} from '../../shared/services/sms/sms.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ToastrService} from 'ngx-toastr';
import {take} from 'rxjs/operators';
import {ConfirmComponent} from '../../components/confirm/confirm.component';
import {ResponseModel} from '../../shared/model/Response/responseModel';
import {AddPanelModalComponent} from '../../components/add-panel-modal/add-panel-modal.component';
import {ScheduleSmsInfoModel} from '../../shared/model/sms/schedule-sms-info.model';
import {AddGroupModalComponent} from '../../components/add-group-modal/add-group-modal.component';
import {AddSmsEventlyModalComponent} from '../../components/add-sms-evently-modal/add-sms-evently-modal.component';
import {Subscription} from 'rxjs';
import {SearchService} from '../../shared/services/search.service';

@Component({
  selector: 'app-personal-evently-sms',
  templateUrl: './EventlySMS.component.html'
})
export class EventlySMSComponent implements OnInit, OnDestroy {
  queryParam: QueryParamModel;
  ssiList: ScheduleSmsInfoModel[] = [];
  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageNumber = 1;
  search: string;
  loading = false;
  private subscriptions: Subscription[] = [];

  constructor(private router: Router,
              private smsService: SmsService,
              private modalService: NgbModal,
              private snakeBar: MatSnackBar,
              private dialog: MatDialog,
              private searchService: SearchService,
              public toaster: ToastrService) {
  }

  ngOnInit() {
    this.onSearch();
    const searchSubscription = this.searchService.filterChanged.subscribe(
      res => {
        this.onSearch(res);
      }
    );
    this.subscriptions.push(searchSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  onSearch(query: string = '') {
    this.search = query;
    this.loadData();
  }

  loadData() {
    this.queryParam = {
      filter: this.search,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sortField: '',
      sortOrder: ''
    };
    this.loading = true;
    this.smsService.getUserSSI(this.queryParam).pipe(
      take(1))
      .subscribe(
        res => {
          if (res && res.Status && res.Status.length === 1 && res.Status[0].status === 200) {
            this.ssiList = res.Result;
            this.length = res.TotalCount;
          } else {
            for (const itm of res.Status) {
              this.toaster.error(res.Status[0].message, 'خطا');
            }
          }
          this.loading = false;
        },
        err => {
          this.toaster.error('خطا در عملیات.', 'خطا');
          this.loading = false;
        }
      );
  }

  deactivate(ssi: ScheduleSmsInfoModel) {
    const dialogTitle = 'تایید عملیات';
    const dialogBody = 'آیا از تغییر وضعیت اطمینان دارید؟';
    const dialogRef = this.dialog.open(ConfirmComponent, {
      height: 'auto',
      data: {title: dialogTitle, body: dialogBody, hasValue: false, value: ''}
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loading = true;
        this.smsService.deactivateSSI(ssi).subscribe(
          res => {
            this.successAndLoad(res);
            this.loading = false;
          },
          err => {
            this.loading = false;
            this.toaster.error('خطا در عملیات.', 'خطا');
          }
        );
      }
    });
  }

  delete(ssi: ScheduleSmsInfoModel) {
    const dialogTitle = 'تایید عملیات';
    const dialogBody = 'آیا از حذف اطمینان دارید؟';
    const dialogRef = this.dialog.open(ConfirmComponent, {
      height: 'auto',
      data: {title: dialogTitle, body: dialogBody, hasValue: false, value: ''}
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loading = true;
        this.smsService.deleteSSI(ssi.id).subscribe(
          res => {
            this.loading = false;
            this.successAndLoad(res);
          },
          err => {
            this.loading = false;
            this.toaster.error('خطا در عملیات.', 'خطا');
          }
        );
      }
    });
  }

  successAndLoad(res: ResponseModel) {
    if (res.Status && res.Status.length === 1 && res.Status[0].status === 200) {
      this.toaster.success('ثبت اطلاعات با موفقیت انجام پذیرفت.', res.Status[0].message);
      this.loadData();
    } else {
      for (const itm of res.Status) {
        this.toaster.error(res.Status[0].message, 'خطا');
      }
    }
  }

  edit(ssi: ScheduleSmsInfoModel) {
    const ref = this.modalService.open(AddSmsEventlyModalComponent, {size: 'lg'});
    ref.componentInstance.ssModel = ssi;
    ref.result.then(res => {
      if ((typeof (res)) !== 'string') {
        this.loading = true;
        this.smsService.editSSI(res).subscribe(
          res => {
            this.loading = false;
            this.successAndLoad(res);
          },
          err => {
            this.loading = false;
            this.toaster.error('خطا در ذخیره سازی.', 'خطا');
          });
      }
    }).catch(err => {
    });
  }

  ceil(itm) {
    return Math.ceil(itm);
  }

  getStart() {
    const no = this.pageNumber - 1;
    const min = Math.min(no * this.pageSize + this.pageSize, this.length);
    if (min === 0) {
      return 'صفر';
    }
    return (no * this.pageSize + 1) + ' تا ' + Math.min(no * this.pageSize + this.pageSize, this.length);
  }

  lunchAddSS() {
    const ref = this.modalService.open(AddSmsEventlyModalComponent);
    ref.result.then(res => {
      if ((typeof (res)) !== 'string') {
        this.loading = true;
        console.log(res);
        this.smsService.addSSI(res).subscribe(
          res => {
            this.loading = false;
            this.successAndLoad(res);
          },
          err => {
            this.loading = false;
            this.toaster.error('خطا در ذخیره سازی.', 'خطا');
          });
      }
    }).catch(err => {
    });
  }

  getTime(itm: ScheduleSmsInfoModel) {
    let str = '';
    if (itm.addedYear > 0) {
      str += itm.addedYear + ' سال';
    }
    if (itm.addedMonth > 0) {
      if (str.length > 0) {
        str += ' و ';
      }
      str += itm.addedMonth + ' ماه';
    }
    if (itm.addedDay > 0) {
      if (str.length > 0) {
        str += ' و ';
      }
      str += itm.addedDay + ' روز';
    }
    return str;
  }
}
