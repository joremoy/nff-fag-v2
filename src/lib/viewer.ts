import { DEFAULT_VIEWER_SECRET_SLUG } from "./constants";

export function getViewerSecretSlug() {
  return process.env.VIEWER_SECRET_SLUG || DEFAULT_VIEWER_SECRET_SLUG;
}

export function isViewerSecretSlug(slug: string) {
  return slug === getViewerSecretSlug();
}
