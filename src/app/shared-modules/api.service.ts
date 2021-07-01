import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpHeaders
} from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class ApiService implements HttpInterceptor {
    // export class ApiService {
    URL = environment.apiUrl;

    urls = {
        login: 'login',
        signup: 'signup',
        getLabmember: 'userByType',
        getalltickets: 'alltickets',
        raiseTicket: 'ticket',
        getTicketById: 'ticket',
        assignTicketToLabMember: 'ticket/assigns',
        memberTicketsByStatus: 'ticket/memberTicketsByStatus',
        assignStatus: 'assign/status',
        assignDesc: 'assign/updateDesc',
        rejectTask: 'assign/taskreject',
        category: 'category',
        status: 'ticketStatus',
        getAllStatus: 'ticket/allTicketsByStatus',
        getTicketByStudentId: 'student/ticket',
        getTimeSlots: 'timeslots'
    };
    get currentDate() {
        return new Date();
    }
    constructor(
        private http: HttpClient
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const dubReq = req.clone({
            url: this.URL + req.url
        });
        return next.handle(dubReq);
    }

    login(payload) {
        return this.http.post(this.urls.login, payload)
    }

    register(payload) {
        return this.http.post(this.urls.signup, payload)
    }
    getTicketById(payload) {
        return this.http.get(this.urls.getTicketById, payload)
    }
    getLabmember(payload) {
        return this.http.get(this.urls.getLabmember, { params: payload })
    }
    getalltickets() {
        return this.http.get(this.urls.getalltickets)
    }


    assignStatus(payload) {
        return this.http.put(this.urls.assignStatus, payload)
    }
    assignDesc(payload) {
        return this.http.post(this.urls.assignDesc, payload)
    }
    raiseTicket(payload) {
        return this.http.post(this.urls.raiseTicket, payload)
    }
    assignTicketToLabMember(payload) {
        return this.http.post(this.urls.assignTicketToLabMember, payload)
    }
    getTicketsByLabMember(payload) {
        return this.http.post(this.urls.memberTicketsByStatus, payload)
    }
    getCategory() {
        return this.http.get(this.urls.category)
    }
    getTicketStatus() {
        return this.http.get(this.urls.status)
    }
    getAllStatus(payload) {
        return this.http.get(this.urls.getAllStatus, { params: payload })
    }
    getTicketByStudentId(payload) {
        return this.http.get(this.urls.getTicketByStudentId, { params: payload })
    }
    getTimeSlots() {
        return this.http.get(this.urls.getTimeSlots)
    }
}

