import { AuthorizationService } from '../index';


describe('AuthorizationService', () => {
  let service: AuthorizationService;

  let JWTToken: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MzU5OTQwMzUsInVzZXJQcm9maWxlIjp7IklEIjoiZ2VhcnlrQGdtYWlsLmNvbSIsImZ1bGxOYW1lIjoiS2V2aW4gR2VhcnkiLCJpc0FkbWluaXN0cmF0b3IiOmZhbHNlLCJpc01hbmFnZXIiOnRydWUsImdyb3VwcyI6WzIwMDldfSwiaWF0IjoxNTM1OTkwNDM1fQ.M6SuNcnQ9r7rvifXBYK6CSWC-6ngLLNkmnjqZ0mUyv8';
  let newJWTToken: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MzYwNjQyMTgsInVzZXJQcm9maWxlIjp7IklEIjoiZ2VhcnlrQGdtYWlsLmNvbSIsImZ1bGxOYW1lIjoiS2V2aW4gR2VhcnkiLCJpc0FkbWluaXN0cmF0b3IiOmZhbHNlLCJpc01hbmFnZXIiOnRydWUsImdyb3VwcyI6WzIwMDldfSwiaWF0IjoxNTM2MDYwNjE4fQ.MQXPgvt-g6-7l2B9YgPC3DDi8CJh5XCZ3xDbDS9oYEc';
  
  let createPasswordJWTToken: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyUHJvZmlsZSI6eyJJRCI6ImVtbWV0dC5vc3VsbGl2YW5AbnR0ZGF0YS5jb20iLCJjcmVhdGVQYXNzd29yZFByb2ZpbGUiOnRydWV9LCJpYXQiOjE1NDI5ODg0MjN9.0_jZEx1o6Izc8nDnrSXfrWEcZklUiHdktG68IoGQNxI';

  beforeEach(() => {
    localStorage.setItem('carraig-og-register.jwt', JWTToken);

    service = new AuthorizationService();
  });
  
  it('should parse token', () => {
    expect(service.getPayload).toEqual({
      userProfile: {
        ID: 'gearyk@gmail.com',
        fullName: 'Kevin Geary',
        isAdministrator: false,
        isManager: true,
        groups: [2009]
      },
      iat: 1535990435,
      exp: 1535994035
    });
  });

  it('should parse valid incoming token', () => {
    jasmine.clock().uninstall();
    jasmine.clock().install();

    jasmine.clock().mockDate(new Date('2018-09-04T12:00:00.000Z'));

    service.parseToken(newJWTToken, true);

    expect(service.getPayload).toEqual({
      userProfile: {
        ID: 'gearyk@gmail.com',
        fullName: 'Kevin Geary',
        isAdministrator: false,
        isManager: true,
        groups: [2009]
      },
      iat: 1536060618,
      exp: 1536064218
    });

    jasmine.clock().uninstall();
  });

  it('should write valid incoming token to local storage', () => {
    jasmine.clock().uninstall();
    jasmine.clock().install();

    jasmine.clock().mockDate(new Date('2018-09-04T12:00:00.000Z'));

    service.parseToken(newJWTToken, true);

    expect(localStorage.getItem('carraig-og-register.jwt')).toEqual(newJWTToken);

    jasmine.clock().uninstall();
  });

  it('should not parse expired incoming token', () => {
    service.parseToken(newJWTToken, true);

    expect(service.getPayload).toEqual({
      userProfile: {
        ID: 'gearyk@gmail.com',
        fullName: 'Kevin Geary',
        isAdministrator: false,
        isManager: true,
        groups: [2009]
      },
      iat: 1535990435,
      exp: 1535994035
    });
  });

  it('should not parse empty token', () => {
    localStorage.removeItem('carraig-og-register.jwt');

    service = new AuthorizationService();

    expect(service.getPayload).toEqual(null);
  });

  it('should return valid active token', () => {
    jasmine.clock().uninstall();
    jasmine.clock().install();

    jasmine.clock().mockDate(new Date('2018-09-04T12:00:00.000Z'));

    service.parseToken(newJWTToken, true);

    expect(service.getActivePayload).toEqual({
      userProfile: {
        ID: 'gearyk@gmail.com',
        fullName: 'Kevin Geary',
        isAdministrator: false,
        isManager: true,
        groups: [2009]
      },
      iat: 1536060618,
      exp: 1536064218
    });

    jasmine.clock().uninstall();
  });

  it('should not return expired active token', () => {
    expect(service.getActivePayload).toBeNull();
  });

  it('should not update payload with create password token', () => {
    service.deleteToken();

    service.parseToken(createPasswordJWTToken, true);

    expect(service.getPayload).toBeNull();
  });

  it('should write create password token to local storage', () => {
    service.parseToken(createPasswordJWTToken, true);

    expect(localStorage.getItem('carraig-og-register.jwt')).toEqual(createPasswordJWTToken);
  });
  
  it('should read token', () => {
    expect(service.readToken()).toEqual('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MzU5OTQwMzUsInVzZXJQcm9maWxlIjp7IklEIjoiZ2VhcnlrQGdtYWlsLmNvbSIsImZ1bGxOYW1lIjoiS2V2aW4gR2VhcnkiLCJpc0FkbWluaXN0cmF0b3IiOmZhbHNlLCJpc01hbmFnZXIiOnRydWUsImdyb3VwcyI6WzIwMDldfSwiaWF0IjoxNTM1OTkwNDM1fQ.M6SuNcnQ9r7rvifXBYK6CSWC-6ngLLNkmnjqZ0mUyv8');
  });

  it('should delete token', () => {
    service.deleteToken();

    expect(localStorage.getItem('carraig-og-register.jwt')).toBeNull();
  });
});
