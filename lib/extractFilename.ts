export function extractFilename(avatarFileURI: string): string {
    // Split the URI by '/' and get the last part (filename)
    const parts = avatarFileURI.split('/');
    return parts[parts.length - 1];
  }