import { useEffect } from 'react';

export function useDocumentTitle(title, description = '') {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title ? `${title} | AI GitHub Repository Analyzer` : 'AI GitHub Repository Analyzer';

    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = description;
    }

    return () => {
      document.title = prevTitle;
    };
  }, [title, description]);
}
