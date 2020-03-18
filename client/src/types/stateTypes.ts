import {
  combinedProfileErrorReducer,
  combinedAuthErrorReducer,
  combinedProfileAuthReducer,
  combinedAuthReducer,
  combinedPostReducer,
  combinedProfileReducer
} from '../reducers/combinedReducers';

  
export type AddEducationComponentState = 
  ReturnType<typeof combinedProfileErrorReducer>;

export type AddExperienceComponentState = 
  ReturnType<typeof combinedProfileErrorReducer>;

export type LoginComponentState = 
  ReturnType<typeof combinedAuthErrorReducer>;

export type RegisterComponentState = 
  ReturnType<typeof combinedAuthErrorReducer>;

export type DashboardComponentState =
  ReturnType<typeof combinedProfileAuthReducer>;

export type NavbarComponentState =
  ReturnType<typeof combinedAuthReducer>;

export type PrivateRouteComponentState =
  ReturnType<typeof combinedAuthReducer>;

export type LandingComponentState =
  ReturnType<typeof combinedAuthReducer>;

export type CommentFormComponentState =
  ReturnType<typeof combinedAuthErrorReducer>;

export type CommentItemComponentState =
  ReturnType<typeof combinedAuthReducer>;

export type PostComponentState =
  ReturnType<typeof combinedPostReducer>;

export type PostFormComponentState =
  ReturnType<typeof combinedAuthErrorReducer>;

export type PostItemComponentState =
  ReturnType<typeof combinedAuthReducer>;
  
export type PostsComponentState =
  ReturnType<typeof combinedPostReducer>;
  
export type ProfileComponentState =
  ReturnType<typeof combinedProfileReducer>;
  
export type SetProfileComponentState =
  ReturnType<typeof combinedProfileErrorReducer>;

export type ProfilesComponentState =
  ReturnType<typeof combinedProfileReducer>;
  