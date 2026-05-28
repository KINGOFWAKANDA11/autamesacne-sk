// Blog rozcestnik
const { useState: useBState, useMemo: useBMemo } = React;

function BlogHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/40 border-b border-slate-100">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-100/40 blur-3xl"></div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
        <div className="text-xs font-bold uppercase tracking-widest text-blue-700 mb-4">Blog</div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.05] tracking-tight">
          Návody, recenzie a tipy <span className="text-blue-900">z prvej ruky</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Píšeme o leasingu, financovaní áut a praktických veciach, na ktoré pri kúpe vozidla narážame.
        </p>
      </div>
    </section>
  );
}

function PostCard({ post, large = false }) {
  const tagColor = TAG_COLORS[post.tag] || "bg-slate-100 text-slate-800";
  return (
    <a
      href={`/blog-detail?slug=${post.slug}`}
      className={`group bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all overflow-hidden flex flex-col ${large ? "lg:flex-row" : ""}`}
    >
      <div className={`relative ${large ? "lg:w-[55%] aspect-[16/10] lg:aspect-auto" : "aspect-[16/10]"} overflow-hidden`}>
        {post.image ? (
          <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${post.color} flex items-center justify-center`}>
            {post.isVideo ? (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/95 text-blue-900 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <Play className="w-7 h-7 sm:w-9 sm:h-9 ml-1" />
              </div>
            ) : (
              <Car className="w-20 h-20 text-white/60 group-hover:scale-110 transition-transform" />
            )}
          </div>
        )}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full ${tagColor} text-xs font-bold`}>
          {post.tag}
        </div>
      </div>

      <div className={`p-6 flex flex-col gap-3 flex-1 ${large ? "lg:p-10 lg:justify-center" : ""}`}>
        <h3 className={`font-extrabold text-slate-900 leading-tight group-hover:text-blue-900 transition-colors ${large ? "text-2xl sm:text-3xl" : "text-lg"}`}>
          {post.title}
        </h3>
        <p className={`text-slate-600 leading-relaxed ${large ? "text-base" : "text-sm"}`}>
          {post.excerpt}
        </p>
        <div className="mt-auto pt-4 flex items-center justify-between text-xs text-slate-500">
          <span>{post.date}</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime}
          </span>
        </div>
      </div>
    </a>
  );
}

function BlogGrid() {
  const [filter, setFilter] = useBState("Všetko");

  const filtered = useBMemo(() => {
    if (filter === "Všetko") return BLOG_POSTS;
    return BLOG_POSTS.filter(p => p.tag === filter);
  }, [filter]);

  const featured = filtered.find(p => p.featured) || filtered[0];
  const rest = filtered.filter(p => p.slug !== (featured?.slug));

  return (
    <section className="bg-white py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Filter */}
        <div className="sticky top-[68px] z-20 bg-white/90 backdrop-blur-md -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 mb-10 border-b border-slate-100">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {BLOG_TAGS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilter(t)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  filter === t
                    ? "bg-blue-900 text-white shadow-md shadow-blue-900/20"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            Pre tento filter zatiaľ nemáme žiadne články.
          </div>
        ) : (
          <>
            {featured && (
              <div className="mb-10">
                <PostCard post={featured} large />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>

            <div className="text-center mt-12">
              <button
                type="button"
                disabled
                className="bg-slate-100 text-slate-400 font-semibold px-6 py-3 rounded-xl cursor-not-allowed"
              >
                Načítať ďalšie články
              </button>
              <p className="text-xs text-slate-400 mt-2">Pripravujeme ďalšie obsahy.</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function BlogApp() {
  return (
    <div className="bg-white text-slate-900 min-h-screen">
      <SiteNav active="blog" />
      <main>
        <BlogHero />
        <BlogGrid />
      </main>
      <SiteFooter />
      <CallbackWidget />
    </div>
  );
}

const blogRoot = ReactDOM.createRoot(document.getElementById("root"));
blogRoot.render(<BlogApp />);
