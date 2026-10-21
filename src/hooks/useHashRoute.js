import { useEffect, useState } from 'react';

/**
 * 작은 데모 프로젝트이므로 React Router 없이 해시 URL을 사용합니다.
 * 예: /#/booth/moon, /#/admin/moon/people
 */
function readPath() {
  return window.location.hash.slice(1).split('?')[0] || '/';
}

export function useHashRoute() {
  const [route, setRoute] = useState(readPath);

  useEffect(() => {
    function handleRouteChange() {
      setRoute(readPath());
      window.scrollTo(0, 0);
    }

    window.addEventListener('hashchange', handleRouteChange);
    return () => window.removeEventListener('hashchange', handleRouteChange);
  }, []);

  function go(path) {
    if (readPath() === path) {
      setRoute(path);
      window.scrollTo(0, 0);
      return;
    }

    window.location.hash = path;
  }

  return { route, go };
}
