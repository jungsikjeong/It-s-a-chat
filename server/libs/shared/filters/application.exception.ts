/**
 * 애플리케이션 전역에서 사용하는 기본 예외 클래스
 *
 * 모든 커스텀 예외 클래스는 이 클래스를 상속받아야 합니다.
 * 각 예외는 고유한 에러 코드와 HTTP 상태 코드를 반환하도록 구현합니다.
 */
export abstract class ApplicationException extends Error {
  abstract getErrorCode(): string;
  abstract getHttpStatus(): number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
