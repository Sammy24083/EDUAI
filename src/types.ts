export type UserRole = 'user' | 'author' | 'editor' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  username: string;
  photoURL?: string;
  bio?: string;
  role: UserRole;
  website?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  createdAt: string;
  updatedAt?: string;
}

export type ArticleStatus = 'draft' | 'published' | 'scheduled';

export interface Article {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  featuredImage: string;
  content: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorPhotoURL?: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  tags: string[];
  status: ArticleStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  readingTime: string;
  views: number;
  likesCount: number;
  savesCount: number;
  commentsCount: number;
  completionsCount?: number;
  ratingsCount?: number;
  averageRating?: number;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  isSponsored?: boolean;
  sponsoredBrand?: string;
  sponsoredUrl?: string;
  isPremium?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  color?: string;
  articleCount?: number;
  createdAt?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  articleCount?: number;
  createdAt?: string;
}

export type CommentStatus = 'approved' | 'pending' | 'flagged' | 'hidden';

export interface Comment {
  id: string;
  articleId: string;
  articleSlug?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  status: CommentStatus;
  likesCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface LikeRecord {
  id: string;
  articleId: string;
  userId: string;
  createdAt: string;
}

export interface SaveRecord {
  id: string;
  articleId: string;
  userId: string;
  articleTitle: string;
  articleSlug: string;
  articleImage?: string;
  categoryName?: string;
  authorName?: string;
  readingTime?: string;
  listId?: string; // Optional: If specified, this save belongs to a specific ReadingList
  createdAt: string;
}

export interface ReadingList {
  id: string;
  userId: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  source?: string;
  subscribedAt: string;
}

export type AdPlacement = 'home_banner' | 'article_top' | 'article_incontent' | 'sidebar' | 'footer';

export interface Advertisement {
  id: string;
  title: string;
  imageUrl?: string;
  destinationUrl: string;
  placement: AdPlacement;
  active: boolean;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  impressions: number;
  clicks: number;
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  contactEmail: string;
  twitterHandle?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  maintenanceMode?: boolean;
  allowComments?: boolean;
  updatedAt?: string;
}
