class LibraryRoute {
  private parameters = () => new URLSearchParams(window.location.hash.slice(1));

  subscribe = (notify: () => void) => {
    window.addEventListener("hashchange", notify);
    return () => window.removeEventListener("hashchange", notify);
  };

  snapshot = () => window.location.hash;
  get = (key: string, fallback = "") => this.parameters().get(key) ?? fallback;

  link = (values: Record<string, string | null>) => {
    const query = this.parameters();
    for (const key of [...query.keys()]) {
      if (!["view", "component", "template", "theme", "scene"].includes(key))
        query.delete(key);
    }
    for (const [key, value] of Object.entries(values)) {
      if (value) query.set(key, value);
      else query.delete(key);
    }
    return "#" + query.toString();
  };

  patch = (values: Record<string, string | null>) => {
    window.location.hash = this.link(values);
  };
}

export const route = new LibraryRoute();
