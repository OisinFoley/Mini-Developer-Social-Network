export const fakeUser = {
  email: 'test1@gmail.com',
  name: 'Test One'
};

export const mockAuth = {
  auth: {
    isAuthenticated: true,
    user: {
      id: 'test_id',
      name: 'test_user',
      avatar: 'test_avatar'
    }
  }
}

export const mockIsNotAuthState = {
  auth: {
    isAuthenticated: false
  },
  errors: {}
}

export const mockIsAuthState = {
  ...mockIsNotAuthState,
  auth: {
    isAuthenticated: true
  },
  user: {
    name: 'test_user'
  }
}