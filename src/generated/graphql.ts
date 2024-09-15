import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Upload: { input: any; output: any; }
};

export type AudioFile = {
  __typename?: 'AudioFile';
  audio_created_at: Scalars['String']['output'];
  audio_description?: Maybe<Scalars['String']['output']>;
  audio_file_id: Scalars['String']['output'];
  audio_file_url: Scalars['String']['output'];
  audio_hls_path?: Maybe<Scalars['String']['output']>;
  audio_title: Scalars['String']['output'];
  book?: Maybe<InsertBookResponse>;
  hlsUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  purchase_code_id: Scalars['String']['output'];
  purchased_at: Scalars['String']['output'];
  user_id: Scalars['String']['output'];
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
  user: GraphqlUser;
};

export type AuthorInput = {
  __typename?: 'AuthorInput';
  authorid: Scalars['ID']['output'];
  bio?: Maybe<Scalars['String']['output']>;
  contact_info?: Maybe<Scalars['String']['output']>;
  profile_picture_url?: Maybe<Scalars['String']['output']>;
};

export type CombinedBook = {
  __typename?: 'CombinedBook';
  author_id?: Maybe<Scalars['ID']['output']>;
  cover_image_url?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  file_name: Scalars['String']['output'];
  file_url: Scalars['String']['output'];
  hls_path?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  purchased_at?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type GraphqlUser = {
  __typename?: 'GraphqlUser';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type ImageUploadInput = {
  docType: Scalars['String']['input'];
  file: Scalars['Upload']['input'];
};

export type InsertBookResponse = {
  __typename?: 'InsertBookResponse';
  file_url: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  becomeAuthor?: Maybe<Response>;
  createUser?: Maybe<Response>;
  insertBook?: Maybe<AudioFile>;
  insertHlsName?: Maybe<Response>;
  insertPurchaseCodes?: Maybe<Response>;
  login: AuthPayload;
  processAudio?: Maybe<AudioFile>;
  redeemCode?: Maybe<Response>;
  requestAudio?: Maybe<RequestAudioResponse>;
  setCurrentAudioFile?: Maybe<Response>;
  updateAuthor?: Maybe<AuthorInput>;
  updatePlaybackProgress?: Maybe<Response>;
};


export type MutationBecomeAuthorArgs = {
  firebase_uid: Scalars['String']['input'];
};


export type MutationCreateUserArgs = {
  email: Scalars['String']['input'];
  firebase_uid: Scalars['String']['input'];
  is_author: Scalars['Boolean']['input'];
  username: Scalars['String']['input'];
};


export type MutationInsertBookArgs = {
  author_id: Scalars['ID']['input'];
  cover_image_url?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  file_name: Scalars['String']['input'];
  file_url: Scalars['String']['input'];
  title: Scalars['String']['input'];
};


export type MutationInsertHlsNameArgs = {
  audio_file_id: Scalars['String']['input'];
  hls_path: Scalars['String']['input'];
};


export type MutationInsertPurchaseCodesArgs = {
  audio_file_id: Scalars['String']['input'];
  author_id: Scalars['String']['input'];
  code: Scalars['String']['input'];
  expires_at: Scalars['String']['input'];
  is_redeemed: Scalars['Boolean']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationProcessAudioArgs = {
  authorId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  docs?: InputMaybe<Array<ImageUploadInput>>;
  fileName: Scalars['String']['input'];
  fileUrl: Scalars['String']['input'];
  title: Scalars['String']['input'];
};


export type MutationRedeemCodeArgs = {
  code: Scalars['String']['input'];
  firebase_uid: Scalars['String']['input'];
};


export type MutationRequestAudioArgs = {
  audioName: Scalars['String']['input'];
};


export type MutationSetCurrentAudioFileArgs = {
  audio_file_id: Scalars['ID']['input'];
  user_id: Scalars['ID']['input'];
};


export type MutationUpdateAuthorArgs = {
  bio?: InputMaybe<Scalars['String']['input']>;
  contact_info?: InputMaybe<Scalars['String']['input']>;
  firebase_uid: Scalars['String']['input'];
  profile_picture_url?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdatePlaybackProgressArgs = {
  audio_file_id: Scalars['ID']['input'];
  firebase_uid: Scalars['ID']['input'];
  progress_seconds: Scalars['Int']['input'];
};

export type ProcessAudioResponse = {
  __typename?: 'ProcessAudioResponse';
  book?: Maybe<InsertBookResponse>;
  hlsUrl?: Maybe<Scalars['String']['output']>;
};

export type PurchaseCodes = {
  __typename?: 'PurchaseCodes';
  audio_file_id: Scalars['String']['output'];
  author_id: Scalars['String']['output'];
  code: Scalars['String']['output'];
  expires_at: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  is_redeemed: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  getAuthor?: Maybe<AuthorInput>;
  getAuthorBooks?: Maybe<Array<Maybe<UploadBook>>>;
  getBookByAudioId?: Maybe<CombinedBook>;
  getCurrentAudioFile?: Maybe<AudioFile>;
  getPurchaseCodes?: Maybe<Array<Maybe<PurchaseCodes>>>;
  getRedeemedBooks?: Maybe<Array<Maybe<RedemeedBooks>>>;
  getUserAudioFiles?: Maybe<Array<Maybe<AudioFile>>>;
  isAuthor?: Maybe<User>;
  userById?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
};


export type QueryGetAuthorArgs = {
  firebase_uid: Scalars['String']['input'];
};


export type QueryGetAuthorBooksArgs = {
  firebase_uid: Scalars['ID']['input'];
};


export type QueryGetBookByAudioIdArgs = {
  firebase_uid: Scalars['String']['input'];
  id: Scalars['String']['input'];
};


export type QueryGetCurrentAudioFileArgs = {
  user_id: Scalars['ID']['input'];
};


export type QueryGetPurchaseCodesArgs = {
  firebase_uid: Scalars['String']['input'];
};


export type QueryGetRedeemedBooksArgs = {
  firebase_uid: Scalars['String']['input'];
};


export type QueryGetUserAudioFilesArgs = {
  firebase_uid: Scalars['String']['input'];
};


export type QueryIsAuthorArgs = {
  firebase_uid: Scalars['String']['input'];
};


export type QueryUserByIdArgs = {
  id: Scalars['ID']['input'];
};

export type RedemeedBooks = {
  __typename?: 'RedemeedBooks';
  cover_image_url?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['String']['output'];
  description: Scalars['String']['output'];
  file_name: Scalars['String']['output'];
  file_url: Scalars['String']['output'];
  hls_path?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  purchased_at: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type RequestAudioResponse = {
  __typename?: 'RequestAudioResponse';
  hlsUrl: Scalars['String']['output'];
};

export type Response = {
  __typename?: 'Response';
  success: Scalars['Boolean']['output'];
};

export type SuccessResult = {
  __typename?: 'SuccessResult';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type UploadBook = {
  __typename?: 'UploadBook';
  author_id: Scalars['ID']['output'];
  cover_image_url?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  file_name: Scalars['String']['output'];
  file_url: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  created_at: Scalars['String']['output'];
  current_audio_file?: Maybe<AudioFile>;
  email: Scalars['String']['output'];
  firebase_uid: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  is_author: Scalars['Boolean']['output'];
  username: Scalars['String']['output'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AudioFile: ResolverTypeWrapper<AudioFile>;
  AuthPayload: ResolverTypeWrapper<AuthPayload>;
  AuthorInput: ResolverTypeWrapper<AuthorInput>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CombinedBook: ResolverTypeWrapper<CombinedBook>;
  GraphqlUser: ResolverTypeWrapper<GraphqlUser>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  ImageUploadInput: ImageUploadInput;
  InsertBookResponse: ResolverTypeWrapper<InsertBookResponse>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  ProcessAudioResponse: ResolverTypeWrapper<ProcessAudioResponse>;
  PurchaseCodes: ResolverTypeWrapper<PurchaseCodes>;
  Query: ResolverTypeWrapper<{}>;
  RedemeedBooks: ResolverTypeWrapper<RedemeedBooks>;
  RequestAudioResponse: ResolverTypeWrapper<RequestAudioResponse>;
  Response: ResolverTypeWrapper<Response>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  SuccessResult: ResolverTypeWrapper<SuccessResult>;
  Upload: ResolverTypeWrapper<Scalars['Upload']['output']>;
  UploadBook: ResolverTypeWrapper<UploadBook>;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AudioFile: AudioFile;
  AuthPayload: AuthPayload;
  AuthorInput: AuthorInput;
  Boolean: Scalars['Boolean']['output'];
  CombinedBook: CombinedBook;
  GraphqlUser: GraphqlUser;
  ID: Scalars['ID']['output'];
  ImageUploadInput: ImageUploadInput;
  InsertBookResponse: InsertBookResponse;
  Int: Scalars['Int']['output'];
  Mutation: {};
  ProcessAudioResponse: ProcessAudioResponse;
  PurchaseCodes: PurchaseCodes;
  Query: {};
  RedemeedBooks: RedemeedBooks;
  RequestAudioResponse: RequestAudioResponse;
  Response: Response;
  String: Scalars['String']['output'];
  SuccessResult: SuccessResult;
  Upload: Scalars['Upload']['output'];
  UploadBook: UploadBook;
  User: User;
};

export type AudioFileResolvers<ContextType = any, ParentType extends ResolversParentTypes['AudioFile'] = ResolversParentTypes['AudioFile']> = {
  audio_created_at?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  audio_description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  audio_file_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  audio_file_url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  audio_hls_path?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  audio_title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  book?: Resolver<Maybe<ResolversTypes['InsertBookResponse']>, ParentType, ContextType>;
  hlsUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  purchase_code_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  purchased_at?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthPayload'] = ResolversParentTypes['AuthPayload']> = {
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['GraphqlUser'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthorInputResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthorInput'] = ResolversParentTypes['AuthorInput']> = {
  authorid?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  contact_info?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  profile_picture_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CombinedBookResolvers<ContextType = any, ParentType extends ResolversParentTypes['CombinedBook'] = ResolversParentTypes['CombinedBook']> = {
  author_id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  cover_image_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  file_name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  file_url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hls_path?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  purchased_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GraphqlUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['GraphqlUser'] = ResolversParentTypes['GraphqlUser']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InsertBookResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['InsertBookResponse'] = ResolversParentTypes['InsertBookResponse']> = {
  file_url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  becomeAuthor?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, RequireFields<MutationBecomeAuthorArgs, 'firebase_uid'>>;
  createUser?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'email' | 'firebase_uid' | 'is_author' | 'username'>>;
  insertBook?: Resolver<Maybe<ResolversTypes['AudioFile']>, ParentType, ContextType, RequireFields<MutationInsertBookArgs, 'author_id' | 'file_name' | 'file_url' | 'title'>>;
  insertHlsName?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, RequireFields<MutationInsertHlsNameArgs, 'audio_file_id' | 'hls_path'>>;
  insertPurchaseCodes?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, RequireFields<MutationInsertPurchaseCodesArgs, 'audio_file_id' | 'author_id' | 'code' | 'expires_at' | 'is_redeemed'>>;
  login?: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'email' | 'password'>>;
  processAudio?: Resolver<Maybe<ResolversTypes['AudioFile']>, ParentType, ContextType, RequireFields<MutationProcessAudioArgs, 'authorId' | 'fileName' | 'fileUrl' | 'title'>>;
  redeemCode?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, RequireFields<MutationRedeemCodeArgs, 'code' | 'firebase_uid'>>;
  requestAudio?: Resolver<Maybe<ResolversTypes['RequestAudioResponse']>, ParentType, ContextType, RequireFields<MutationRequestAudioArgs, 'audioName'>>;
  setCurrentAudioFile?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, RequireFields<MutationSetCurrentAudioFileArgs, 'audio_file_id' | 'user_id'>>;
  updateAuthor?: Resolver<Maybe<ResolversTypes['AuthorInput']>, ParentType, ContextType, RequireFields<MutationUpdateAuthorArgs, 'firebase_uid'>>;
  updatePlaybackProgress?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, RequireFields<MutationUpdatePlaybackProgressArgs, 'audio_file_id' | 'firebase_uid' | 'progress_seconds'>>;
};

export type ProcessAudioResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProcessAudioResponse'] = ResolversParentTypes['ProcessAudioResponse']> = {
  book?: Resolver<Maybe<ResolversTypes['InsertBookResponse']>, ParentType, ContextType>;
  hlsUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PurchaseCodesResolvers<ContextType = any, ParentType extends ResolversParentTypes['PurchaseCodes'] = ResolversParentTypes['PurchaseCodes']> = {
  audio_file_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  author_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expires_at?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  is_redeemed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getAuthor?: Resolver<Maybe<ResolversTypes['AuthorInput']>, ParentType, ContextType, RequireFields<QueryGetAuthorArgs, 'firebase_uid'>>;
  getAuthorBooks?: Resolver<Maybe<Array<Maybe<ResolversTypes['UploadBook']>>>, ParentType, ContextType, RequireFields<QueryGetAuthorBooksArgs, 'firebase_uid'>>;
  getBookByAudioId?: Resolver<Maybe<ResolversTypes['CombinedBook']>, ParentType, ContextType, RequireFields<QueryGetBookByAudioIdArgs, 'firebase_uid' | 'id'>>;
  getCurrentAudioFile?: Resolver<Maybe<ResolversTypes['AudioFile']>, ParentType, ContextType, RequireFields<QueryGetCurrentAudioFileArgs, 'user_id'>>;
  getPurchaseCodes?: Resolver<Maybe<Array<Maybe<ResolversTypes['PurchaseCodes']>>>, ParentType, ContextType, RequireFields<QueryGetPurchaseCodesArgs, 'firebase_uid'>>;
  getRedeemedBooks?: Resolver<Maybe<Array<Maybe<ResolversTypes['RedemeedBooks']>>>, ParentType, ContextType, RequireFields<QueryGetRedeemedBooksArgs, 'firebase_uid'>>;
  getUserAudioFiles?: Resolver<Maybe<Array<Maybe<ResolversTypes['AudioFile']>>>, ParentType, ContextType, RequireFields<QueryGetUserAudioFilesArgs, 'firebase_uid'>>;
  isAuthor?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryIsAuthorArgs, 'firebase_uid'>>;
  userById?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserByIdArgs, 'id'>>;
  users?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
};

export type RedemeedBooksResolvers<ContextType = any, ParentType extends ResolversParentTypes['RedemeedBooks'] = ResolversParentTypes['RedemeedBooks']> = {
  cover_image_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  file_name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  file_url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hls_path?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  purchased_at?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RequestAudioResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['RequestAudioResponse'] = ResolversParentTypes['RequestAudioResponse']> = {
  hlsUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['Response'] = ResolversParentTypes['Response']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SuccessResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['SuccessResult'] = ResolversParentTypes['SuccessResult']> = {
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type UploadBookResolvers<ContextType = any, ParentType extends ResolversParentTypes['UploadBook'] = ResolversParentTypes['UploadBook']> = {
  author_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  cover_image_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  file_name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  file_url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  created_at?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  current_audio_file?: Resolver<Maybe<ResolversTypes['AudioFile']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firebase_uid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  is_author?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AudioFile?: AudioFileResolvers<ContextType>;
  AuthPayload?: AuthPayloadResolvers<ContextType>;
  AuthorInput?: AuthorInputResolvers<ContextType>;
  CombinedBook?: CombinedBookResolvers<ContextType>;
  GraphqlUser?: GraphqlUserResolvers<ContextType>;
  InsertBookResponse?: InsertBookResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  ProcessAudioResponse?: ProcessAudioResponseResolvers<ContextType>;
  PurchaseCodes?: PurchaseCodesResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RedemeedBooks?: RedemeedBooksResolvers<ContextType>;
  RequestAudioResponse?: RequestAudioResponseResolvers<ContextType>;
  Response?: ResponseResolvers<ContextType>;
  SuccessResult?: SuccessResultResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  UploadBook?: UploadBookResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

