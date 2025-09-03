/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>;

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  'body' | 'method' | 'query' | 'path'
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>;
  securityWorker?: (
    securityData: SecurityDataType | null
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = 'application/json',
  JsonApi = 'application/vnd.api+json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = '';
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: 'include',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join('&');
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      key => 'undefined' !== typeof query[key]
    );
    return keys
      .map(key =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key)
      )
      .join('&');
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : '';
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string')
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string')
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== 'string'
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
              ? JSON.stringify(property)
              : `${property}`
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { 'Content-Type': type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === 'undefined' || body === null
            ? null
            : payloadFormatter(body),
      }
    ).then(async response => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then(data => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch(e => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title 업무 관리 대시보드 API
 * @version 1.0.0
 * @license MIT (https://opensource.org/licenses/MIT)
 * @contact API Support <support@example.com>
 *
 *
 *             ## 업무 관리 대시보드 API 문서
 *
 *             이 API는 교육 과정 관리, 출퇴근 기록, 공지사항, 이슈 관리 등의 기능을 제공합니다.
 *
 *             ### 주요 기능
 *             - **인증 관리**: 로그인/로그아웃, 사용자 정보 조회
 *             - **공지사항**: 공지사항 CRUD, 읽음 표시, 페이지네이션 및 필터링
 *             - **업무 체크리스트**: 정기/비정기 업무 체크리스트 관리
 *             - **이슈 관리**: 이슈 등록, 댓글, 해결 처리
 *             - **출퇴근 기록**: 출퇴근 시간 기록 및 조회, 월별 필터링 및 페이지네이션
 *             - **훈련 과정**: 훈련 과정 정보 관리
 *             - **관리자 기능**: 체크율 통계, 미체크 항목 관리
 *             - **알림**: Slack 연동 알림 시스템
 *
 *             ### 페이지네이션
 *             목록 조회 API는 페이지네이션을 지원합니다:
 *             - `page`: 페이지 번호 (기본값: 1)
 *             - `per_page`: 페이지당 항목 수 (기본값: 10, 최대: 100)
 *
 *             페이지네이션 응답 형식:
 *             ```json
 *             {
 *                 "success": true,
 *                 "message": "조회 성공",
 *                 "data": {
 *                     "items": [...],
 *                     "pagination": {
 *                         "page": 1,
 *                         "per_page": 10,
 *                         "total_count": 25,
 *                         "total_pages": 3,
 *                         "has_next": true,
 *                         "has_prev": false
 *                     }
 *                 },
 *                 "status_code": 200
 *             }
 *             ```
 *
 *             ### 필터링 기능
 *             - **공지사항**: 유형별 필터링, 제목/내용 검색
 *             - **출퇴근 기록**: 년도/월별 필터링, 강사별 필터링, 훈련과정별 필터링
 *
 *             ### 인증
 *             대부분의 API는 세션 기반 인증을 사용합니다. 로그인 후 세션 쿠키가 자동으로 설정됩니다.
 *
 *             ### 응답 형식
 *             모든 API는 다음과 같은 통일된 응답 형식을 사용합니다:
 *             ```json
 *             {
 *                 "success": true,
 *                 "message": "성공 메시지",
 *                 "data": { ... },
 *                 "status_code": 200
 *             }
 *             ```
 *
 *             ### 에러 처리
 *             에러 발생 시 다음과 같은 형식으로 응답합니다:
 *             ```json
 *             {
 *                 "success": false,
 *                 "message": "에러 메시지",
 *                 "status_code": 400
 *             }
 *             ```
 *
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description API 서버의 기본 정보를 조회합니다. ### 사용 예시 ```javascript const response = await fetch('/', { method: 'GET' }); const result = await response.json(); console.log(result); ```
   *
   * @tags System
   * @name GetRoot
   * @summary API 서버 루트 경로
   * @request GET:/
   */
  getRoot = (params: RequestParams = {}) =>
    this.request<
      {
        data?: {
          /** @example "ok" */
          status?: string;
          /** @example "1.0.0" */
          version?: string;
        };
        /** @example "API 서버가 정상적으로 실행 중입니다." */
        message?: string;
        /** @example 200 */
        status_code?: number;
        /** @example true */
        success?: boolean;
      },
      any
    >({
      path: `/`,
      method: 'GET',
      format: 'json',
      ...params,
    });

  admin = {
    /**
     * @description 사용자가 로그인한 경우 관리자 대시보드 (admin.html)을 반환합니다. 로그인하지 않은 경우 로그인 페이지로 이동됩니다. ### 사용 예시 ```javascript // 브라우저에서 직접 접근 window.location.href = '/admin'; // 또는 fetch로 HTML 내용 가져오기 const response = await fetch('/admin', { method: 'GET', credentials: 'include' }); if (response.redirected) { // 로그인 페이지로 리다이렉트된 경우 window.location.href = response.url; } else { const html = await response.text(); document.body.innerHTML = html; } ```
     *
     * @tags Views
     * @name AdminList
     * @summary 관리자 대시보드 API
     * @request GET:/admin
     */
    adminList: (params: RequestParams = {}) =>
      this.request<string, void>({
        path: `/admin`,
        method: 'GET',
        ...params,
      }),

    /**
     * @description 특정 날짜의 훈련 과정별 업무 체크리스트 체크율을 조회합니다. ### 사용 예시 ```javascript // 당일 체크율 조회 const response = await fetch('/admin/task_status', { method: 'GET', credentials: 'include' }); // 특정 날짜 체크율 조회 const response = await fetch('/admin/task_status?date=2025-01-15', { method: 'GET', credentials: 'include' }); const result = await response.json(); console.log(result); ```
     *
     * @tags Admin
     * @name TaskStatusList
     * @summary 훈련 과정별 업무 체크리스트 체크율 조회 API
     * @request GET:/admin/task_status
     */
    taskStatusList: (
      query?: {
        /**
         * 조회할 날짜 (YYYY-MM-DD 형식, 기본값은 당일)
         * @example "2025-01-15"
         */
        date?: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<
        {
          data?: {
            task_status?: {
              /** @example "80.0%" */
              check_rate?: string;
              /** @example "TechSol" */
              dept?: string;
              /** @example "데이터 분석 스쿨 4기" */
              training_course?: string;
            }[];
            /**
             * @format date-time
             * @example "2025-01-15T10:30:00"
             */
            timestamp?: string;
            /** @example 5 */
            total_courses?: number;
          };
          /** @example "업무 체크 상태 조회 성공" */
          message?: string;
          /** @example true */
          success?: boolean;
        },
        | {
            /** @example null */
            details?: object;
            /** @example "잘못된 날짜 형식입니다. YYYY-MM-DD 형식으로 입력해주세요." */
            error?: string;
            /** @example 400 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
        | {
            /** @example null */
            details?: object;
            /** @example "업무 체크 상태 조회 실패" */
            error?: string;
            /** @example 500 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
      >({
        path: `/admin/task_status`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * @description 각 훈련 과정별로 담당자, 당일 체크율, 전날 체크율, 전체 체크율을 조회합니다. 종료된 지 1주일 이내의 과정만 포함됩니다. ### 사용 예시 ```javascript const response = await fetch('/admin/task_status_combined', { method: 'GET', credentials: 'include' }); const result = await response.json(); console.log(result); ```
     *
     * @tags Admin
     * @name TaskStatusCombinedList
     * @summary 훈련 과정별 통합 체크율 조회 API
     * @request GET:/admin/task_status_combined
     */
    taskStatusCombinedList: (params: RequestParams = {}) =>
      this.request<
        {
          data?: {
            /** @example "80.0%" */
            daily_check_rate?: string;
            /** @example "TechSol" */
            dept?: string;
            /** @example "홍길동" */
            manager_name?: string;
            /** @example "78.5%" */
            overall_check_rate?: string;
            /** @example "데이터 분석 스쿨 4기" */
            training_course?: string;
            /** @example "75.0%" */
            yesterday_check_rate?: string;
          }[];
          /** @example "통합 업무 체크 상태 조회 성공" */
          message?: string;
          /** @example true */
          success?: boolean;
        },
        {
          /** @example null */
          details?: object;
          /** @example "통합 업무 체크 상태 조회 실패" */
          error?: string;
          /** @example 500 */
          status_code?: number;
          /** @example false */
          success?: boolean;
        }
      >({
        path: `/admin/task_status_combined`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description 모든 훈련 과정의 전체 체크율을 조회합니다. ### 사용 예시 ```javascript const response = await fetch('/admin/task_status_overall', { method: 'GET', credentials: 'include' }); const result = await response.json(); console.log(result); ```
     *
     * @tags Admin
     * @name TaskStatusOverallList
     * @summary 훈련 과정별 전체 체크율 조회 API
     * @request GET:/admin/task_status_overall
     */
    taskStatusOverallList: (params: RequestParams = {}) =>
      this.request<
        {
          data?: {
            /** @example "80.0%" */
            check_rate?: string;
            /** @example "TechSol" */
            dept?: string;
            /** @example "데이터 분석 스쿨 4기" */
            training_course?: string;
          }[];
          /** @example "전체 업무 체크 상태 조회 성공" */
          message?: string;
          /** @example true */
          success?: boolean;
        },
        {
          /** @example null */
          details?: object;
          /** @example "전체 업무 체크 상태 조회 실패" */
          error?: string;
          /** @example 500 */
          status_code?: number;
          /** @example false */
          success?: boolean;
        }
      >({
        path: `/admin/task_status_overall`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  };
  attendance = {
    /**
     * @description 출퇴근 기록을 월별로 필터링하고 페이지네이션을 통해 조회하거나 파일로 다운로드합니다. ### 사용 예시 ```javascript // 기본 조회 (최신 10개) const response = await fetch('/attendance', { method: 'GET', credentials: 'include' }); // 특정 월 조회 const response = await fetch('/attendance?year=2025&month=1', { method: 'GET', credentials: 'include' }); // 페이지네이션 적용 const response = await fetch('/attendance?year=2025&month=1&page=2&per_page=5', { method: 'GET', credentials: 'include' }); // 강사별 필터링 const response = await fetch('/attendance?instructor=1', { method: 'GET', credentials: 'include' }); // Excel 파일로 다운로드 const response = await fetch('/attendance?format=excel&year=2025&month=1', { method: 'GET', credentials: 'include' }); const result = await response.json(); console.log(result); ```
     *
     * @tags Attendance
     * @name AttendanceList
     * @summary 출퇴근 기록 조회 API (월별 필터링 및 페이지네이션 지원)
     * @request GET:/attendance
     */
    attendanceList: (
      query?: {
        /**
         * 페이지 번호 (기본값: 1)
         * @example 1
         */
        page?: number;
        /**
         * 페이지당 항목 수 (기본값: 10, 최대: 100)
         * @example 10
         */
        per_page?: number;
        /**
         * 조회할 년도
         * @example 2025
         */
        year?: number;
        /**
         * 조회할 월 (1-12)
         * @example 1
         */
        month?: number;
        /**
         * 강사 ID 필터
         * @example "1"
         */
        instructor?: string;
        /**
         * 훈련 과정명 필터
         * @example "데이터 분석 스쿨 4기"
         */
        training_course?: string;
        /**
         * 강사명 또는 훈련과정명 검색
         * @example "홍길동"
         */
        search?: string;
        /**
         * excel 형식으로 다운로드 (기본값 JSON 반환)
         * @example "excel"
         */
        format?: string;
        /**
         * 조회할 레코드 개수 제한 (페이지네이션 무시)
         * @example 10
         */
        limit?: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<
        {
          data?: {
            items?: {
              /** @example "09:00" */
              check_in?: string;
              /** @example "18:00" */
              check_out?: string;
              /** @example true */
              daily_log?: boolean;
              /**
               * @format date
               * @example "2025-01-15"
               */
              date?: string;
              /** @example 1 */
              id?: number;
              /** @example "1" */
              instructor?: string;
              /** @example "홍길동" */
              instructor_name?: string;
              /** @example "데이터 분석 스쿨 4기" */
              training_course?: string;
            }[];
            pagination?: {
              /** @example true */
              has_next?: boolean;
              /** @example false */
              has_prev?: boolean;
              /** @example 1 */
              page?: number;
              /** @example 10 */
              per_page?: number;
              /** @example 25 */
              total_count?: number;
              /** @example 3 */
              total_pages?: number;
            };
          };
          /** @example "출퇴근 기록 조회 성공" */
          message?: string;
          /** @example true */
          success?: boolean;
        },
        | {
            /** @example null */
            details?: object;
            /** @example "잘못된 월 값입니다." */
            error?: string;
            /** @example 400 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
        | {
            /** @example null */
            details?: object;
            /** @example "출퇴근 기록 조회 실패" */
            error?: string;
            /** @example 500 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
      >({
        path: `/attendance`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * @description 새로운 출퇴근 기록을 저장합니다. ### 사용 예시 ```javascript const response = await fetch('/attendance', { method: 'POST', headers: { 'Content-Type': 'application/json', }, credentials: 'include', body: JSON.stringify({ date: '2025-01-15', instructor: '1', instructor_name: '홍길동', training_course: '데이터 분석 스쿨 4기', check_in: '09:00', check_out: '18:00', daily_log: true }) }); const result = await response.json(); console.log(result); ```
     *
     * @tags Attendance
     * @name AttendanceCreate
     * @summary 출퇴근 기록 저장 API
     * @request POST:/attendance
     */
    attendanceCreate: (
      body: {
        /**
         * 출근 시간 (HH:MM 형식)
         * @example "09:00"
         */
        check_in: string;
        /**
         * 퇴근 시간 (HH:MM 형식)
         * @example "18:00"
         */
        check_out: string;
        /**
         * 일일 로그 작성 여부
         * @example true
         */
        daily_log?: boolean;
        /**
         * 출퇴근 날짜
         * @format date
         * @example "2025-01-15"
         */
        date: string;
        /**
         * 강사 ID
         * @example "1"
         */
        instructor: string;
        /**
         * 강사명
         * @example "홍길동"
         */
        instructor_name: string;
        /**
         * 훈련 과정명
         * @example "데이터 분석 스쿨 4기"
         */
        training_course: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<
        {
          data?: {
            /** @example "09:00" */
            check_in?: string;
            /** @example "18:00" */
            check_out?: string;
            /** @example true */
            daily_log?: boolean;
            /**
             * @format date
             * @example "2025-01-15"
             */
            date?: string;
            /** @example 1 */
            id?: number;
            /** @example "1" */
            instructor?: string;
            /** @example "홍길동" */
            instructor_name?: string;
            /** @example "데이터 분석 스쿨 4기" */
            training_course?: string;
          };
          /** @example "출퇴근 기록 저장 성공!" */
          message?: string;
          /** @example true */
          success?: boolean;
        },
        | {
            /** @example null */
            details?: object;
            /** @example "날짜, 강사 정보, 훈련 과정, 출퇴근 시간은 필수 입력 항목입니다." */
            error?: string;
            /** @example 400 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
        | {
            /** @example null */
            details?: object;
            /** @example "출퇴근 기록 저장 실패" */
            error?: string;
            /** @example 500 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
      >({
        path: `/attendance`,
        method: 'POST',
        body: body,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  };
  frontForPro = {
    /**
     * @description 사용자가 로그인한 경우 대시보드 페이지 (front_for_pro.html)을 반환합니다. 로그인하지 않은 경우 로그인 페이지로 이동됩니다. ### 사용 예시 ```javascript // 브라우저에서 직접 접근 window.location.href = '/front_for_pro'; // 또는 fetch로 HTML 내용 가져오기 const response = await fetch('/front_for_pro', { method: 'GET', credentials: 'include' }); if (response.redirected) { // 로그인 페이지로 리다이렉트된 경우 window.location.href = response.url; } else { const html = await response.text(); document.body.innerHTML = html; } ```
     *
     * @tags Views
     * @name FrontForProList
     * @summary 프론트엔드 개발자용 대시보드 API
     * @request GET:/front_for_pro
     */
    frontForProList: (params: RequestParams = {}) =>
      this.request<string, void>({
        path: `/front_for_pro`,
        method: 'GET',
        ...params,
      }),
  };
  healthcheck = {
    /**
     * @description API 서버의 상태를 확인합니다. ### 사용 예시 ```javascript const response = await fetch('/healthcheck', { method: 'GET' }); const result = await response.json(); console.log(result); ```
     *
     * @tags System
     * @name HealthcheckList
     * @summary 시스템 상태 확인 API
     * @request GET:/healthcheck
     */
    healthcheckList: (params: RequestParams = {}) =>
      this.request<
        {
          data?: {
            /** @example "ok" */
            status?: string;
          };
          /** @example "Service is running!" */
          message?: string;
          /** @example 200 */
          status_code?: number;
          /** @example true */
          success?: boolean;
        },
        any
      >({
        path: `/healthcheck`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  };
  irregularTasks = {
    /**
     * @description 비정기 업무 체크리스트의 가장 최근 상태를 조회합니다. ### 사용 예시 ```javascript const response = await fetch('/irregular_tasks', { method: 'GET', credentials: 'include' }); const result = await response.json(); console.log(result); ```
     *
     * @tags Irregular Tasks
     * @name IrregularTasksList
     * @summary 비정기 업무 체크리스트 조회 API
     * @request GET:/irregular_tasks
     */
    irregularTasksList: (params: RequestParams = {}) =>
      this.request<
        {
          data?: {
            /**
             * @format date-time
             * @example "2025-01-15T10:30:00"
             */
            checked_date?: string;
            /** @example 1 */
            id?: number;
            /** @example false */
            is_checked?: boolean;
            /** @example "프로젝트 발표" */
            task_name?: string;
            /** @example "데이터 분석 스쿨 4기" */
            training_course?: string;
          }[];
          /** @example "비정기 업무 체크리스트 조회 성공" */
          message?: string;
          /** @example true */
          success?: boolean;
        },
        {
          /** @example null */
          details?: object;
          /** @example "비정기 업무 조회 실패" */
          error?: string;
          /** @example 500 */
          status_code?: number;
          /** @example false */
          success?: boolean;
        }
      >({
        path: `/irregular_tasks`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description 비정기 업무 체크리스트를 저장합니다. 기존 데이터를 덮어씌우지 않고 새로운 체크 상태를 추가합니다. ### 사용 예시 ```javascript const response = await fetch('/irregular_tasks', { method: 'POST', headers: { 'Content-Type': 'application/json', }, credentials: 'include', body: JSON.stringify({ updates: [ { task_name: "프로젝트 발표", is_checked: true }, { task_name: "포트폴리오 작성", is_checked: false } ], training_course: "데이터 분석 스쿨 4기" }) }); const result = await response.json(); console.log(result); ```
     *
     * @tags Irregular Tasks
     * @name IrregularTasksCreate
     * @summary 비정기 업무 체크리스트 추가 저장 API
     * @request POST:/irregular_tasks
     */
    irregularTasksCreate: (
      body: {
        /**
         * 훈련 과정명
         * @example "데이터 분석 스쿨 4기"
         */
        training_course: string;
        /** 비정기 업무 체크리스트 업데이트 항목들 */
        updates: {
          /**
           * 체크 여부
           * @example true
           */
          is_checked?: boolean;
          /**
           * 업무 항목명
           * @example "프로젝트 발표"
           */
          task_name?: string;
        }[];
      },
      params: RequestParams = {}
    ) =>
      this.request<
        {
          /** @example null */
          data?: any;
          /** @example "비정기 업무 체크리스트가 저장되었습니다!" */
          message?: string;
          /** @example true */
          success?: boolean;
        },
        {
          /** @example null */
          details?: object;
          /** @example "비정기 업무 체크리스트 저장 실패" */
          error?: string;
          /** @example 500 */
          status_code?: number;
          /** @example false */
          success?: boolean;
        }
      >({
        path: `/irregular_tasks`,
        method: 'POST',
        body: body,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  };
  issues = {
    /**
     * @description 해결되지 않은 이슈들의 목록을 조회합니다. ### 사용 예시 ```javascript const response = await fetch('/issues', { method: 'GET', credentials: 'include' }); const result = await response.json(); console.log(result); ```
     *
     * @tags Issues
     * @name IssuesList
     * @summary 해결되지 않은 이슈 목록 조회 API
     * @request GET:/issues
     */
    issuesList: (params: RequestParams = {}) =>
      this.request<
        {
          data?: {
            issues?: {
              comments?: {
                /** @example "이 문제는 이미 확인했습니다." */
                comment?: string;
                /**
                 * @format date-time
                 * @example "2025-01-15T11:00:00"
                 */
                created_at?: string;
                /** @example "관리자" */
                created_by?: string;
                /** @example 1 */
                id?: number;
              }[];
              /** @example "시스템 로그인이 안 되는 문제가 있습니다." */
              issue?: string;
              /**
               * @format date-time
               * @example "2025-01-15T10:30:00"
               */
              created_at?: string;
              /**
               * @format date
               * @example "2025-01-15"
               */
              date?: string;
              /** @example 1 */
              id?: number;
              /** @example false */
              resolved?: boolean;
              /** @example "데이터 분석 스쿨 4기" */
              training_course?: string;
              /** @example "홍길동" */
              username?: string;
              created_by?: string;
            }[];
            /** @example "데이터 분석 스쿨 4기" */
            training_course?: string;
          }[];
          /** @example "이슈 목록 조회 성공" */
          message?: string;
          /** @example true */
          success?: boolean;
        },
        {
          /** @example null */
          details?: object;
          /** @example "이슈 목록을 불러오는 중 오류 발생" */
          error?: string;
          /** @example 500 */
          status_code?: number;
          /** @example false */
          success?: boolean;
        }
      >({
        path: `/issues`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description 새로운 이슈를 생성합니다. 생성 후 Slack 알림이 자동으로 전송됩니다. ### 사용 예시 ```javascript const response = await fetch('/issues', { method: 'POST', headers: { 'Content-Type': 'application/json', }, credentials: 'include', body: JSON.stringify({ content: '시스템 로그인이 안 되는 문제가 있습니다.', training_course: '데이터 분석 스쿨 4기', username: '홍길동', date: '2025-01-15' }) }); const result = await response.json(); console.log(result); ```
     *
     * @tags Issues
     * @name IssuesCreate
     * @summary 이슈 생성 API
     * @request POST:/issues
     */
    issuesCreate: (
      body: {
        /**
         * 이슈 내용
         * @example "시스템 로그인이 안 되는 문제가 있습니다."
         */
        content: string;
        /**
         * 이슈 발생 날짜 (선택사항)
         * @example "2025-01-15"
         */
        date?: string;
        /**
         * 교육 과정명
         * @example "데이터 분석 스쿨 4기"
         */
        training_course: string;
        /**
         * 작성자명
         * @example "홍길동"
         */
        username: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<
        {
          data?: {
            /** @example "시스템 로그인이 안 되는 문제가 있습니다." */
            content?: string;
            /**
             * @format date-time
             * @example "2025-01-15T10:30:00"
             */
            created_at?: string;
            /**
             * @format date
             * @example "2025-01-15"
             */
            date?: string;
            /** @example 1 */
            id?: number;
            /** @example false */
            resolved?: boolean;
            /** @example "데이터 분석 스쿨 4기" */
            training_course?: string;
            /** @example "홍길동" */
            username?: string;
          };
          /** @example "이슈가 성공적으로 생성되었습니다." */
          message?: string;
          /** @example true */
          success?: boolean;
        },
        | {
            /** @example null */
            details?: object;
            /** @example "이슈 내용, 교육 과정, 작성자는 필수 입력 항목입니다." */
            error?: string;
            /** @example 400 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
        | {
            /** @example null */
            details?: object;
            /** @example "이슈 생성 중 오류가 발생했습니다." */
            error?: string;
            /** @example 500 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
      >({
        path: `/issues`,
        method: 'POST',
        body: body,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description 특정 이슈에 등록된 댓글들의 목록을 조회합니다. ### 사용 예시 ```javascript const response = await fetch('/issues/comments?issue_id=1', { method: 'GET', credentials: 'include' }); const result = await response.json(); console.log(result); ```
     *
     * @tags Issues
     * @name CommentsList
     * @summary 이슈사항의 댓글 조회 API
     * @request GET:/issues/comments
     */
    commentsList: (
      query: {
        /**
         * 조회할 이슈 ID
         * @example 1
         */
        issue_id: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<
        {
          data?: {
            /** @example "이 문제는 이미 확인했습니다. 곧 해결하겠습니다." */
            comment?: string;
            /**
             * @format date-time
             * @example "2025-01-15T11:00:00"
             */
            created_at?: string;
            /** @example "관리자" */
            created_by?: string;
            /** @example 1 */
            id?: number;
            /** @example 1 */
            issue_id?: number;
          }[];
          /** @example "댓글 조회 성공" */
          message?: string;
          /** @example true */
          success?: boolean;
        },
        {
          /** @example null */
          details?: object;
          /** @example "댓글 조회 실패" */
          error?: string;
          /** @example 500 */
          status_code?: number;
          /** @example false */
          success?: boolean;
        }
      >({
        path: `/issues/comments`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * @description 특정 이슈에 댓글을 추가합니다. 댓글 등록 후 Slack 알림이 전송됩니다. ### 사용 예시 ```javascript const response = await fetch('/issues/comments', { method: 'POST', headers: { 'Content-Type': 'application/json', }, credentials: 'include', body: JSON.stringify({ issue_id: 1, comment: '이 문제는 이미 확인했습니다. 곧 해결하겠습니다.', created_by: '관리자' }) }); const result = await response.json(); console.log(result); ```
     *
     * @tags Issues
     * @name CommentsCreate
     * @summary 이슈 댓글 추가 API
     * @request POST:/issues/comments
     */
    commentsCreate: (
      body: {
        /**
         * 댓글 내용
         * @example "이 문제는 이미 확인했습니다. 곧 해결하겠습니다."
         */
        comment: string;
        /**
         * 작성자명
         * @example "관리자"
         */
        created_by: string;
        /**
         * 이슈 ID
         * @example 1
         */
        issue_id: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<
        {
          data?: {
            /** @example "이 문제는 이미 확인했습니다. 곧 해결하겠습니다." */
            comment?: string;
            /**
             * @format date-time
             * @example "2025-01-15T11:00:00"
             */
            created_at?: string;
            /** @example "관리자" */
            created_by?: string;
            /** @example 1 */
            id?: number;
            /** @example 1 */
            issue_id?: number;
          };
          /** @example "댓글이 등록되었습니다." */
          message?: string;
          /** @example true */
          success?: boolean;
        },
        | {
            /** @example null */
            details?: object;
            /** @example "이슈 ID, 댓글 내용, 작성자는 필수 입력 항목입니다." */
            error?: string;
            /** @example 400 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
        | {
            /** @example null */
            details?: object;
            /** @example "해당 이슈를 찾을 수 없습니다." */
            error?: string;
            /** @example 404 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
        | {
            /** @example null */
            details?: object;
            /** @example "댓글 등록 실패" */
            error?: string;
            /** @example 500 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
      >({
        path: `/issues/comments`,
        method: 'POST',
        body: body,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description 모든 이슈사항을 Excel 파일로 다운로드합니다. ### 사용 예시 ```javascript const response = await fetch('/issues/download', { method: 'GET', credentials: 'include' }); // 파일 다운로드 처리 const blob = await response.blob(); const url = window.URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = '이슈사항.xlsx'; a.click(); ```
     *
     * @tags Issues
     * @name DownloadList
     * @summary 이슈사항을 Excel 파일로 다운로드하는 API
     * @request GET:/issues/download
     */
    downloadList: (params: RequestParams = {}) =>
      this.request<
        File,
        {
          /** @example null */
          details?: object;
          /** @example "이슈 다운로드 실패" */
          error?: string;
          /** @example 500 */
          status_code?: number;
          /** @example false */
          success?: boolean;
        }
      >({
        path: `/issues/download`,
        method: 'GET',
        ...params,
      }),

    /**
     * @description 특정 이슈를 해결 처리합니다. 해결된 이슈는 목록에서 제외됩니다. ### 사용 예시 ```javascript const response = await fetch('/issues/resolve', { method: 'POST', headers: { 'Content-Type': 'application/json', }, credentials: 'include', body: JSON.stringify({ issue_id: 1 }) }); const result = await response.json(); console.log(result); ```
     *
     * @tags Issues
     * @name ResolveCreate
     * @summary 이슈 해결 API
     * @request POST:/issues/resolve
     */
    resolveCreate: (
      body: {
        /**
         * 해결할 이슈 ID
         * @example 1
         */
        issue_id: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<
        {
          data?: {
            /** @example "시스템 로그인이 안 되는 문제가 있습니다." */
            content?: string;
            /**
             * @format date-time
             * @example "2025-01-15T10:30:00"
             */
            created_at?: string;
            /**
             * @format date
             * @example "2025-01-15"
             */
            date?: string;
            /** @example 1 */
            id?: number;
            /** @example true */
            resolved?: boolean;
            /** @example "데이터 분석 스쿨 4기" */
            training_course?: string;
            /** @example "홍길동" */
            username?: string;
          };
          /** @example "이슈가 해결되었습니다." */
          message?: string;
          /** @example true */
          success?: boolean;
        },
        | {
            /** @example null */
            details?: object;
            /** @example "이슈 ID를 입력해주세요." */
            error?: string;
            /** @example 400 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
        | {
            /** @example null */
            details?: object;
            /** @example "이슈 해결 실패" */
            error?: string;
            /** @example 500 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
      >({
        path: `/issues/resolve`,
        method: 'POST',
        body: body,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  };
  login = {
    /**
     * @description 사용자명과 비밀번호를 받아 로그인을 처리합니다. 로그인 성공 시 세션 쿠키가 자동으로 설정됩니다. ### 사용 예시 ```javascript const response = await fetch('/login', { method: 'POST', headers: { 'Content-Type': 'application/json', }, credentials: 'include', // 세션 쿠키 포함 body: JSON.stringify({ username: 'user123', password: 'password123' }) }); const result = await response.json(); console.log(result); ```
     *
     * @tags Authentication
     * @name LoginCreate
     * @summary 사용자 로그인 API
     * @request POST:/login
     */
    loginCreate: (
      body: {
        /**
         * 비밀번호
         * @example "password123"
         */
        password: string;
        /**
         * 사용자명
         * @example "user123"
         */
        username: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<
        {
          data?: {
            /** @example 1 */
            id?: number;
            /** @example "홍길동" */
            name?: string;
            /** @example "user" */
            role?: string;
            /** @example "user123" */
            username?: string;
          };
          /** @example "로그인 성공!" */
          message?: string;
          /** @example true */
          success?: boolean;
        },
        | {
            /** @example null */
            details?: object;
            /** @example "사용자명과 비밀번호를 입력해주세요." */
            error?: string;
            /** @example 400 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
        | {
            /** @example null */
            details?: object;
            /** @example "잘못된 사용자명 또는 비밀번호입니다." */
            error?: string;
            /** @example 401 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
        | {
            /** @example null */
            details?: object;
            /** @example "서버 오류 발생" */
            error?: string;
            /** @example 500 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
      >({
        path: `/login`,
        method: 'POST',
        body: body,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  };
  logout = {
    /**
     * @description 현재 로그인된 사용자의 세션을 삭제합니다. ### 사용 예시 ```javascript const response = await fetch('/logout', { method: 'POST', credentials: 'include' // 세션 쿠키 포함 }); const result = await response.json(); console.log(result); ```
     *
     * @tags Authentication
     * @name LogoutCreate
     * @summary 사용자 로그아웃 API
     * @request POST:/logout
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.request<
        {
          /** @example null */
          data?: any;
          /** @example "로그아웃 완료!" */
          message?: string;
          /** @example true */
          success?: boolean;
        },
        any
      >({
        path: `/logout`,
        method: 'POST',
        format: 'json',
        ...params,
      }),
  };
  me = {
    /**
     * @description 현재 세션에 로그인된 사용자의 정보를 반환합니다. ### 사용 예시 ```javascript const response = await fetch('/me', { method: 'GET', credentials: 'include' // 세션 쿠키 포함 }); const result = await response.json(); console.log(result); ```
     *
     * @tags Authentication
     * @name GetMe
     * @summary 현재 로그인된 사용자 정보 조회 API
     * @request GET:/me
     */
    getMe: (params: RequestParams = {}) =>
      this.request<
        {
          data?: {
            user?: {
              /** @example 1 */
              id?: number;
              /** @example "홍길동" */
              name?: string;
              /** @example "user" */
              role?: string;
              /** @example "user123" */
              username?: string;
            };
          };
          /** @example "사용자 정보 조회 성공" */
          message?: string;
          /** @example true */
          success?: boolean;
        },
        {
          /** @example null */
          details?: object;
          /** @example "로그인이 필요합니다." */
          error?: string;
          /** @example 401 */
          status_code?: number;
          /** @example false */
          success?: boolean;
        }
      >({
        path: `/me`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  };
  notices = {
    /**
     * @description 등록된 공지사항을 페이지네이션을 통해 조회합니다. ### 사용 예시 ```javascript // 기본 조회 (1페이지, 10개씩) const response = await fetch('/notices', { method: 'GET', credentials: 'include' }); // 페이지네이션 적용 const response = await fetch('/notices?page=2&per_page=5', { method: 'GET', credentials: 'include' }); // 필터링 적용 const response = await fetch('/notices?type=공지사항&search=회의', { method: 'GET', credentials: 'include' }); const result = await response.json(); console.log(result); ```
     *
     * @tags Notices
     * @name NoticesList
     * @summary 공지사항 조회 API (페이지네이션 지원)
     * @request GET:/notices
     */
    noticesList: (
      query?: {
        /**
         * 페이지 번호 (기본값: 1)
         * @example 1
         */
        page?: number;
        /**
         * 페이지당 항목 수 (기본값: 10, 최대: 100)
         * @example 10
         */
        per_page?: number;
        /**
         * 공지사항 유형 필터
         * @example "공지사항"
         */
        type?: string;
        /**
         * 제목 또는 내용 검색
         * @example "회의"
         */
        search?: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<
        {
          data?: {
            items?: {
              /** @example "내일 오후 2시에 전체 회의가 있습니다." */
              content?: string;
              /** @example "관리자" */
              created_by?: string;
              /**
               * @format date-time
               * @example "2025-01-15T10:30:00"
               */
              date?: string;
              /** @example 1 */
              id?: number;
              /** @example "중요 공지사항" */
              title?: string;
              /** @example "공지사항" */
              type?: string;
            }[];
            pagination?: {
              /** @example true */
              has_next?: boolean;
              /** @example false */
              has_prev?: boolean;
              /** @example 1 */
              page?: number;
              /** @example 10 */
              per_page?: number;
              /** @example 25 */
              total_count?: number;
              /** @example 3 */
              total_pages?: number;
            };
          };
          /** @example "공지사항 조회 성공" */
          message?: string;
          /** @example true */
          success?: boolean;
        },
        | {
            /** @example null */
            details?: object;
            /** @example "잘못된 페이지 번호입니다." */
            error?: string;
            /** @example 400 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
        | {
            /** @example null */
            details?: object;
            /** @example "공지사항을 불러오는데 실패했습니다." */
            error?: string;
            /** @example 500 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
      >({
        path: `/notices`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * @description 새로운 공지사항을 생성합니다. 생성 후 Slack 알림이 자동으로 전송됩니다. ### 사용 예시 ```javascript const response = await fetch('/notices', { method: 'POST', headers: { 'Content-Type': 'application/json', }, credentials: 'include', body: JSON.stringify({ title: '중요 공지사항', content: '내일 오후 2시에 전체 회의가 있습니다.', created_by: '관리자', type: '공지사항' }) }); const result = await response.json(); console.log(result); ```
     *
     * @tags Notices
     * @name NoticesCreate
     * @summary 공지사항 추가 API
     * @request POST:/notices
     */
    noticesCreate: (
      body: {
        /**
         * 공지사항 내용
         * @example "내일 오후 2시에 전체 회의가 있습니다."
         */
        content: string;
        /**
         * 작성자명
         * @example "관리자"
         */
        created_by: string;
        /**
         * 공지사항 제목
         * @example "중요 공지사항"
         */
        title: string;
        /**
         * 공지사항 유형, 기본값은 공지사항
         * @example "공지사항"
         */
        type?: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<
        {
          data?: {
            /** @example "내일 오후 2시에 전체 회의가 있습니다." */
            content?: string;
            /**
             * @format date-time
             * @example "2025-01-15T10:30:00"
             */
            created_at?: string;
            /** @example "관리자" */
            created_by?: string;
            /** @example 1 */
            id?: number;
            /** @example "중요 공지사항" */
            title?: string;
            /** @example "공지사항" */
            type?: string;
          };
          /** @example "공지사항이 성공적으로 생성되었습니다." */
          message?: string;
          /** @example true */
          success?: boolean;
        },
        | {
            /** @example null */
            details?: object;
            /** @example "제목, 내용, 작성자는 필수 입력 항목입니다." */
            error?: string;
            /** @example 400 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
        | {
            /** @example null */
            details?: object;
            /** @example "공지사항 작성 권한이 없습니다." */
            error?: string;
            /** @example 403 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
        | {
            /** @example null */
            details?: object;
            /** @example "공지사항 추가 실패" */
            error?: string;
            /** @example 500 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
      >({
        path: `/notices`,
        method: 'POST',
        body: body,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description 특정 사용자가 공지사항을 읽었다고 표시합니다. ### 사용 예시 ```javascript const response = await fetch('/notices/read', { method: 'POST', headers: { 'Content-Type': 'application/json', }, credentials: 'include', body: JSON.stringify({ notice_id: 1, username: '홍길동' }) }); const result = await response.json(); console.log(result); ```
     *
     * @tags Notices
     * @name ReadCreate
     * @summary 공지사항 읽음 표시 API
     * @request POST:/notices/read
     */
    readCreate: (
      body: {
        /**
         * 공지사항 ID
         * @example 1
         */
        notice_id: number;
        /**
         * 사용자명
         * @example "홍길동"
         */
        username: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<
        {
          data?: {
            /** @example 1 */
            id?: number;
            /** @example 1 */
            notice_id?: number;
            /**
             * @format date-time
             * @example "2025-01-15T11:00:00"
             */
            read_at?: string;
            /** @example "홍길동" */
            username?: string;
          };
          /** @example "읽음 표시가 완료되었습니다." */
          message?: string;
          /** @example true */
          success?: boolean;
        },
        | {
            /** @example null */
            details?: object;
            /** @example "공지사항 ID와 사용자명을 입력해주세요." */
            error?: string;
            /** @example 400 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
        | {
            /** @example null */
            details?: object;
            /** @example "공지사항 읽음 표시 실패" */
            error?: string;
            /** @example 500 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
      >({
        path: `/notices/read`,
        method: 'POST',
        body: body,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description 특정 공지사항을 읽은 사용자들의 목록을 조회합니다. ### 사용 예시 ```javascript const response = await fetch('/notices/reads?notice_id=1', { method: 'GET', credentials: 'include' }); const result = await response.json(); console.log(result); ```
     *
     * @tags Notices
     * @name ReadsList
     * @summary 공지사항별 읽은 사용자 목록 조회 API
     * @request GET:/notices/reads
     */
    readsList: (
      query: {
        /**
         * 조회할 공지사항 ID
         * @example 1
         */
        notice_id: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<
        {
          data?: {
            /** @example 1 */
            id?: number;
            /**
             * @format date-time
             * @example "2025-01-15T11:00:00"
             */
            read_at?: string;
            /** @example "홍길동" */
            username?: string;
          }[];
          /** @example "공지사항 읽음 목록 조회 성공" */
          message?: string;
          /** @example true */
          success?: boolean;
        },
        | {
            /** @example null */
            details?: object;
            /** @example "공지사항 ID를 입력해주세요." */
            error?: string;
            /** @example 400 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
        | {
            /** @example null */
            details?: object;
            /** @example "공지사항 읽음 목록 조회 실패" */
            error?: string;
            /** @example 500 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
      >({
        path: `/notices/reads`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * @description 지정된 ID의 공지사항을 삭제합니다. ### 사용 예시 ```javascript const response = await fetch('/notices/1', { method: 'DELETE', credentials: 'include' }); const result = await response.json(); console.log(result); ```
     *
     * @tags Notices
     * @name NoticesDelete
     * @summary 공지사항 삭제 API
     * @request DELETE:/notices/{notice_id}
     */
    noticesDelete: (noticeId: number, params: RequestParams = {}) =>
      this.request<
        {
          data?: {
            /** @example "삭제된 공지사항 내용" */
            content?: string;
            /**
             * @format date-time
             * @example "2025-01-15T10:30:00"
             */
            created_at?: string;
            /** @example "관리자" */
            created_by?: string;
            /** @example 1 */
            id?: number;
            /** @example "삭제된 공지사항" */
            title?: string;
            /** @example "공지사항" */
            type?: string;
          };
          /** @example "공지사항이 성공적으로 삭제되었습니다." */
          message?: string;
          /** @example true */
          success?: boolean;
        },
        | {
            /** @example null */
            details?: object;
            /** @example "해당 공지사항을 찾을 수 없습니다." */
            error?: string;
            /** @example 404 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
        | {
            /** @example null */
            details?: object;
            /** @example "공지사항 삭제 중 오류가 발생했습니다." */
            error?: string;
            /** @example 500 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
      >({
        path: `/notices/${noticeId}`,
        method: 'DELETE',
        format: 'json',
        ...params,
      }),

    /**
     * @description 지정된 ID의 공지사항을 수정합니다. ### 사용 예시 ```javascript const response = await fetch('/notices/1', { method: 'PUT', headers: { 'Content-Type': 'application/json', }, credentials: 'include', body: JSON.stringify({ title: '수정된 공지사항 제목', content: '수정된 공지사항 내용입니다.', type: '공지사항', username: '홍길동' }) }); const result = await response.json(); console.log(result); ```
     *
     * @tags Notices
     * @name NoticesUpdate
     * @summary 공지사항 수정 API
     * @request PUT:/notices/{notice_id}
     */
    noticesUpdate: (
      noticeId: number,
      body: {
        /** @example "수정된 공지사항 내용입니다." */
        content?: string;
        /** @example "수정된 공지사항 제목" */
        title?: string;
        /** @example "공지사항" */
        type?: string;
        /** @example "홍길동" */
        username?: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<
        {
          data?: {
            /** @example "수정된 공지사항 내용입니다." */
            content?: string;
            /**
             * @format date-time
             * @example "2025-01-15T10:30:00"
             */
            created_at?: string;
            /** @example "관리자" */
            created_by?: string;
            /** @example 1 */
            id?: number;
            /** @example "수정된 공지사항 제목" */
            title?: string;
            /** @example "공지사항" */
            type?: string;
          };
          /** @example "공지사항이 성공적으로 수정되었습니다." */
          message?: string;
          /** @example true */
          success?: boolean;
        },
        | {
            /** @example null */
            details?: object;
            /** @example "수정할 내용을 입력해주세요." */
            error?: string;
            /** @example 400 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
        | {
            /** @example null */
            details?: object;
            /** @example "해당 공지사항을 찾을 수 없습니다." */
            error?: string;
            /** @example 404 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
        | {
            /** @example null */
            details?: object;
            /** @example "공지사항 수정 중 오류가 발생했습니다." */
            error?: string;
            /** @example 500 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
      >({
        path: `/notices/${noticeId}`,
        method: 'PUT',
        body: body,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  };
  notifications = {
    /**
     * @description 특정 사용자의 미확인 알림 개수를 조회하고 마지막 확인 시간을 업데이트합니다. ### 사용 예시 ```javascript const response = await fetch('/notifications/unread-count?username=홍길동', { method: 'GET', credentials: 'include' }); const result = await response.json(); console.log(result); ```
     *
     * @tags Notifications
     * @name UnreadCountList
     * @summary 사용자별 미확인 알림 개수 조회 API
     * @request GET:/notifications/unread-count
     */
    unreadCountList: (
      query: {
        /**
         * 사용자명
         * @example "홍길동"
         */
        username: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<
        {
          data?: {
            /** @example 5 */
            new_comments?: number;
            /** @example 2 */
            new_issues?: number;
            /** @example 3 */
            new_notices?: number;
          };
          /** @example "미확인 알림 개수 조회 성공" */
          message?: string;
          /** @example true */
          success?: boolean;
        },
        | {
            /** @example null */
            details?: object;
            /** @example "사용자명을 입력해주세요." */
            error?: string;
            /** @example 400 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
        | {
            /** @example null */
            details?: object;
            /** @example "알림 개수 조회 실패" */
            error?: string;
            /** @example 500 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
      >({
        path: `/notifications/unread-count`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),
  };
  tasks = {
    /**
     * @description 업무 체크리스트 데이터를 조회합니다. 카테고리별 필터링이 가능합니다. ### 사용 예시 ```javascript // 모든 업무 체크리스트 조회 const response = await fetch('/tasks', { method: 'GET', credentials: 'include' }); // 특정 카테고리의 업무 체크리스트 조회 const response = await fetch('/tasks?task_category=개발', { method: 'GET', credentials: 'include' }); const result = await response.json(); console.log(result); ```
     *
     * @tags Tasks
     * @name TasksList
     * @summary 업무 체크리스트 조회 API
     * @request GET:/tasks
     */
    tasksList: (
      query?: {
        /**
         * 업무 체크리스트의 카테고리 (예: 개발, 디자인)
         * @example "개발"
         */
        task_category?: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<
        {
          data?: {
            /** @example 1 */
            due?: number;
            /** @example "매일 출석을 체크합니다" */
            guide?: string;
            /** @example 1 */
            id?: number;
            /** @example "일반" */
            task_category?: string;
            /** @example "출석 체크" */
            task_name?: string;
            /** @example "일일" */
            task_period?: string;
          }[];
          /** @example "업무 체크리스트 조회 성공" */
          message?: string;
          /** @example true */
          success?: boolean;
        },
        {
          /** @example null */
          details?: object;
          /** @example "업무 체크리스트 조회 실패" */
          error?: string;
          /** @example 500 */
          status_code?: number;
          /** @example false */
          success?: boolean;
        }
      >({
        path: `/tasks`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * @description 업무 체크리스트를 저장합니다. 동일한 날짜의 데이터가 있으면 업데이트됩니다. ### 사용 예시 ```javascript const response = await fetch('/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json', }, credentials: 'include', body: JSON.stringify({ updates: [ { task_name: "출석 체크", is_checked: true }, { task_name: "과제 제출", is_checked: false } ], training_course: "데이터 분석 스쿨 4기", username: "홍길동" }) }); const result = await response.json(); console.log(result); ```
     *
     * @tags Tasks
     * @name TasksCreate
     * @summary 업무 체크리스트 저장 API
     * @request POST:/tasks
     */
    tasksCreate: (
      body: {
        /**
         * 훈련 과정명
         * @example "데이터 분석 스쿨 4기"
         */
        training_course: string;
        /** 체크리스트 업데이트 항목들 */
        updates: {
          /**
           * 체크 여부
           * @example true
           */
          is_checked: boolean;
          /**
           * 업무 항목명
           * @example "출석 체크"
           */
          task_name: string;
        }[];
        /**
         * 사용자명
         * @example "홍길동"
         */
        username: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<
        {
          /** @example null */
          data?: any;
          /** @example "체크리스트가 성공적으로 저장/업데이트되었습니다!" */
          message?: string;
          /** @example true */
          success?: boolean;
        },
        | {
            /** @example null */
            details?: object;
            /** @example "요청 데이터가 없습니다." */
            error?: string;
            /** @example 400 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
        | {
            /** @example null */
            details?: object;
            /** @example "체크리스트 저장 실패" */
            error?: string;
            /** @example 500 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
      >({
        path: `/tasks`,
        method: 'POST',
        body: body,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description 당일 저장된 체크리스트를 업데이트합니다. 기존 데이터가 없으면 404 에러가 발생합니다. ### 사용 예시 ```javascript const response = await fetch('/tasks/update', { method: 'PUT', headers: { 'Content-Type': 'application/json', }, credentials: 'include', body: JSON.stringify({ updates: [ { task_name: "출석 체크", is_checked: true }, { task_name: "과제 제출", is_checked: true } ], training_course: "데이터 분석 스쿨 4기" }) }); const result = await response.json(); console.log(result); ```
     *
     * @tags Tasks
     * @name UpdateUpdate
     * @summary 당일 업무 체크리스트 업데이트 API
     * @request PUT:/tasks/update
     */
    updateUpdate: (
      body: {
        /**
         * 훈련 과정명
         * @example "데이터 분석 스쿨 4기"
         */
        training_course: string;
        /** 체크리스트 업데이트 항목들 */
        updates: {
          /**
           * 체크 여부
           * @example true
           */
          is_checked: boolean;
          /**
           * 업무 항목명
           * @example "출석 체크"
           */
          task_name: string;
        }[];
      },
      params: RequestParams = {}
    ) =>
      this.request<
        {
          data?: {
            /** @example "데이터 분석 스쿨 4기" */
            training_course?: string;
            /** @example 2 */
            updated_count?: number;
          };
          /** @example "체크리스트가 성공적으로 업데이트되었습니다!" */
          message?: string;
          /** @example true */
          success?: boolean;
        },
        | {
            /** @example null */
            details?: object;
            /** @example "업데이트할 체크리스트가 존재하지 않습니다." */
            error?: string;
            /** @example 404 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
        | {
            /** @example null */
            details?: object;
            /** @example "체크리스트 업데이트 실패" */
            error?: string;
            /** @example 500 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
      >({
        path: `/tasks/update`,
        method: 'PUT',
        body: body,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  };
  trainingCourses = {
    /**
     * @description (현재 진행 중이거나 종료된 지 1주일 이내의 과정만 반환)<br/>
     *
     * @tags Training Info
     * @name TrainingCoursesList
     * @summary training_info 테이블에서 training_course 목록을 가져오는 API
     * @request GET:/training_courses
     */
    trainingCoursesList: (params: RequestParams = {}) =>
      this.request<
        {
          /** @example ["데이터 분석 스쿨 4기","웹 개발 스쿨 3기"] */
          data?: string[];
          /** @example "훈련 과정 목록 조회 성공" */
          message?: string;
          /** @example true */
          success?: boolean;
        },
        {
          /** @example null */
          details?: object;
          /** @example "훈련 과정 목록을 불러오는데 실패했습니다." */
          error?: string;
          /** @example 500 */
          status_code?: number;
          /** @example false */
          success?: boolean;
        }
      >({
        path: `/training_courses`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  };
  trainingInfo = {
    /**
     * @description 저장된 모든 훈련 과정 정보를 조회합니다. ### 사용 예시 ```javascript const response = await fetch('/training_info', { method: 'GET', credentials: 'include' }); const result = await response.json(); console.log(result); ```
     *
     * @tags Training Info
     * @name TrainingInfoList
     * @summary 훈련 과정 목록 조회 API
     * @request GET:/training_info
     */
    trainingInfoList: (params: RequestParams = {}) =>
      this.request<
        {
          data?: {
            /** @example "TechSol" */
            dept?: string;
            /**
             * @format date
             * @example "2025-06-01"
             */
            end_date?: string;
            /** @example 1 */
            id?: number;
            /** @example "홍길동" */
            manager_name?: string;
            /**
             * @format date
             * @example "2025-01-02"
             */
            start_date?: string;
            /** @example "데이터 분석 스쿨 4기" */
            training_course?: string;
          }[];
          /** @example "훈련 과정 목록 조회 성공" */
          message?: string;
          /** @example true */
          success?: boolean;
        },
        {
          /** @example null */
          details?: object;
          /** @example "훈련 과정 목록 조회 실패" */
          error?: string;
          /** @example 500 */
          status_code?: number;
          /** @example false */
          success?: boolean;
        }
      >({
        path: `/training_info`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description 새로운 훈련 과정 정보를 저장합니다. ### 사용 예시 ```javascript const response = await fetch('/training_info', { method: 'POST', headers: { 'Content-Type': 'application/json', }, credentials: 'include', body: JSON.stringify({ training_course: "데이터 분석 스쿨 100기", start_date: "2025-01-02", end_date: "2025-06-01", dept: "TechSol", manager_name: "홍길동" }) }); const result = await response.json(); console.log(result); ```
     *
     * @tags Training Info
     * @name TrainingInfoCreate
     * @summary 훈련 과정 정보 저장 API
     * @request POST:/training_info
     */
    trainingInfoCreate: (
      body: {
        /** @example "TechSol" */
        dept: string;
        /**
         * @format date
         * @example "2025-06-01"
         */
        end_date: string;
        /** @example "홍길동" */
        manager_name: string;
        /**
         * @format date
         * @example "2025-01-02"
         */
        start_date: string;
        /** @example "데이터 분석 스쿨 100기" */
        training_course: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<
        {
          data?: {
            /** @example "TechSol" */
            dept?: string;
            /**
             * @format date
             * @example "2025-06-01"
             */
            end_date?: string;
            /** @example 1 */
            id?: number;
            /** @example "홍길동" */
            manager_name?: string;
            /**
             * @format date
             * @example "2025-01-02"
             */
            start_date?: string;
            /** @example "데이터 분석 스쿨 100기" */
            training_course?: string;
          };
          /** @example "훈련 과정이 저장되었습니다!" */
          message?: string;
          /** @example true */
          success?: boolean;
        },
        | {
            /** @example null */
            details?: object;
            /** @example "필수 필드가 누락되었습니다." */
            error?: string;
            /** @example 400 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
        | {
            /** @example null */
            details?: object;
            /** @example "훈련 과정 저장 실패" */
            error?: string;
            /** @example 500 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
      >({
        path: `/training_info`,
        method: 'POST',
        body: body,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  };
  uncheckedComments = {
    /**
     * @description 특정 미체크 항목의 댓글 목록을 조회합니다. ### 사용 예시 ```javascript const response = await fetch('/unchecked_comments?unchecked_id=1', { method: 'GET', credentials: 'include' }); const result = await response.json(); console.log(result); ```
     *
     * @tags Unchecked Comments
     * @name UncheckedCommentsList
     * @summary 미체크 항목의 댓글 조회 API
     * @request GET:/unchecked_comments
     */
    uncheckedCommentsList: (
      query: {
        /**
         * 조회할 미체크 항목 ID
         * @example 1
         */
        unchecked_id: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<
        {
          data?: {
            /** @example "이 문제를 해결하기 위해 추가 조치가 필요합니다." */
            comment?: string;
            /**
             * @format date-time
             * @example "2025-01-15T10:30:00"
             */
            created_at?: string;
            /** @example 1 */
            id?: number;
            /** @example 1 */
            unchecked_id?: number;
          }[];
          /** @example "미체크 항목 댓글 조회 성공" */
          message?: string;
          /** @example true */
          success?: boolean;
        },
        | {
            /** @example null */
            details?: object;
            /** @example "미체크 항목 ID가 누락되었습니다." */
            error?: string;
            /** @example 400 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
        | {
            /** @example null */
            details?: object;
            /** @example "미체크 항목 댓글 조회 실패" */
            error?: string;
            /** @example 500 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
      >({
        path: `/unchecked_comments`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * @description 특정 미체크 항목에 댓글을 추가합니다. ### 사용 예시 ```javascript const response = await fetch('/unchecked_comments', { method: 'POST', headers: { 'Content-Type': 'application/json', }, credentials: 'include', body: JSON.stringify({ unchecked_id: 1, comment: "이 문제를 해결하기 위해 추가 조치가 필요합니다." }) }); const result = await response.json(); console.log(result); ```
     *
     * @tags Unchecked Comments
     * @name UncheckedCommentsCreate
     * @summary 미체크 항목에 댓글 추가 API
     * @request POST:/unchecked_comments
     */
    uncheckedCommentsCreate: (
      body: {
        /**
         * 댓글 내용
         * @example "이 문제를 해결하기 위해 추가 조치가 필요합니다."
         */
        comment: string;
        /**
         * 미체크 항목 ID
         * @example 1
         */
        unchecked_id: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<
        {
          /** @example null */
          data?: any;
          /** @example "댓글이 저장되었습니다." */
          message?: string;
          /** @example true */
          success?: boolean;
        },
        | {
            /** @example null */
            details?: object;
            /** @example "요청 데이터가 올바르지 않습니다." */
            error?: string;
            /** @example 400 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
        | {
            /** @example null */
            details?: object;
            /** @example "댓글 저장 실패" */
            error?: string;
            /** @example 500 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
      >({
        path: `/unchecked_comments`,
        method: 'POST',
        body: body,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  };
  uncheckedDescriptions = {
    /**
     * @description 미체크 항목의 설명과 액션 플랜을 부서명과 함께 조회합니다. ### 사용 예시 ```javascript const response = await fetch('/unchecked_descriptions', { method: 'GET', credentials: 'include' }); const result = await response.json(); console.log(result); ```
     *
     * @tags Unchecked Descriptions
     * @name UncheckedDescriptionsList
     * @summary 미체크 항목 설명 및 액션 플랜 조회 API (부서명 포함)
     * @request GET:/unchecked_descriptions
     */
    uncheckedDescriptionsList: (params: RequestParams = {}) =>
      this.request<
        {
          data?: {
            /** @example "매일 출석을 체크하도록 안내" */
            action_plan?: string;
            /** @example "출석 체크 미완료" */
            content?: string;
            /**
             * @format date-time
             * @example "2025-01-15T10:30:00"
             */
            created_at?: string;
            /**
             * @format date
             * @example "2025-01-18"
             */
            deadline?: string;
            /** @example "TechSol" */
            dept?: string;
            /** @example 3 */
            due_days?: number;
            /** @example 1 */
            id?: number;
            /** @example false */
            is_overdue?: boolean;
            /** @example false */
            resolved?: boolean;
            /** @example "데이터 분석 스쿨 4기" */
            training_course?: string;
          }[];
          /** @example "미체크 항목 목록 조회 성공" */
          message?: string;
          /** @example true */
          success?: boolean;
        },
        {
          /** @example null */
          details?: object;
          /** @example "미체크 항목 목록 조회 실패" */
          error?: string;
          /** @example 500 */
          status_code?: number;
          /** @example false */
          success?: boolean;
        }
      >({
        path: `/unchecked_descriptions`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description 새로운 미체크 항목의 설명과 액션 플랜을 저장합니다. ### 사용 예시 ```javascript const response = await fetch('/unchecked_descriptions', { method: 'POST', headers: { 'Content-Type': 'application/json', }, credentials: 'include', body: JSON.stringify({ content: "출석 체크 미완료", action_plan: "매일 출석을 체크하도록 안내", training_course: "데이터 분석 스쿨 4기" }) }); const result = await response.json(); console.log(result); ```
     *
     * @tags Unchecked Descriptions
     * @name UncheckedDescriptionsCreate
     * @summary 미체크 항목 설명과 액션 플랜 저장 API
     * @request POST:/unchecked_descriptions
     */
    uncheckedDescriptionsCreate: (
      body: {
        /**
         * 액션 플랜
         * @example "매일 출석을 체크하도록 안내"
         */
        action_plan: string;
        /**
         * 미체크 항목 내용
         * @example "출석 체크 미완료"
         */
        description: string;
        /**
         * 훈련 과정명
         * @example "데이터 분석 스쿨 4기"
         */
        training_course: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<
        {
          /** @example null */
          data?: any;
          /** @example "미체크 항목과 액션 플랜이 저장되었습니다!" */
          message?: string;
          /** @example true */
          success?: boolean;
        },
        | {
            /** @example null */
            details?: object;
            /** @example "필수 데이터가 누락되었습니다." */
            error?: string;
            /** @example 400 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
        | {
            /** @example null */
            details?: object;
            /** @example "미체크 항목 저장 실패" */
            error?: string;
            /** @example 500 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
      >({
        path: `/unchecked_descriptions`,
        method: 'POST',
        body: body,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description 특정 미체크 항목을 해결된 상태로 변경합니다. ### 사용 예시 ```javascript const response = await fetch('/unchecked_descriptions/resolve', { method: 'POST', headers: { 'Content-Type': 'application/json', }, credentials: 'include', body: JSON.stringify({ unchecked_id: 1 }) }); const result = await response.json(); console.log(result); ```
     *
     * @tags Unchecked Descriptions
     * @name ResolveCreate
     * @summary 미체크 항목 해결 API
     * @request POST:/unchecked_descriptions/resolve
     */
    resolveCreate: (
      body: {
        /**
         * 해결할 미체크 항목 ID
         * @example 1
         */
        unchecked_id: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<
        {
          /** @example null */
          data?: any;
          /** @example "미체크 항목이 해결되었습니다." */
          message?: string;
          /** @example true */
          success?: boolean;
        },
        | {
            /** @example null */
            details?: object;
            /** @example "요청 데이터가 올바르지 않습니다." */
            error?: string;
            /** @example 400 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
        | {
            /** @example null */
            details?: object;
            /** @example "미체크 항목 해결 실패" */
            error?: string;
            /** @example 500 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
      >({
        path: `/unchecked_descriptions/resolve`,
        method: 'POST',
        body: body,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  };
  user = {
    /**
     * @description 현재 비밀번호를 확인한 후 새로운 비밀번호로 변경합니다. ### 사용 예시 ```javascript const response = await fetch('/user/change-password', { method: 'POST', headers: { 'Content-Type': 'application/json', }, credentials: 'include', body: JSON.stringify({ username: 'user123', current_password: 'current123', new_password: 'new123' }) }); const result = await response.json(); console.log(result); ```
     *
     * @tags Authentication
     * @name ChangePasswordCreate
     * @summary 사용자 비밀번호 변경 API
     * @request POST:/user/change-password
     */
    changePasswordCreate: (
      body: {
        /**
         * 현재 비밀번호
         * @example "current123"
         */
        current_password: string;
        /**
         * 새로운 비밀번호
         * @example "new123"
         */
        new_password: string;
        /**
         * 사용자명
         * @example "user123"
         */
        username: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<
        {
          /** @example null */
          data?: any;
          /** @example "비밀번호가 성공적으로 변경되었습니다." */
          message?: string;
          /** @example true */
          success?: boolean;
        },
        | {
            /** @example null */
            details?: object;
            /** @example "모든 필드를 입력해주세요." */
            error?: string;
            /** @example 400 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
        | {
            /** @example null */
            details?: object;
            /** @example "현재 비밀번호가 일치하지 않습니다." */
            error?: string;
            /** @example 401 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
        | {
            /** @example null */
            details?: object;
            /** @example "비밀번호 변경 중 오류가 발생했습니다." */
            error?: string;
            /** @example 500 */
            status_code?: number;
            /** @example false */
            success?: boolean;
          }
      >({
        path: `/user/change-password`,
        method: 'POST',
        body: body,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  };
}
