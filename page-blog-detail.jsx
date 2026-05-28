// Blog detail page
const { useState: useBDState, useEffect: useBDEffect } = React;

function getSlugFromURL() {
  // Path /blog/:slug or query ?slug=
  const path = window.location.pathname;
  const match = path.match(/^\/blog\/([^\/]+)$/);
  if (match) return decodeURIComponent(match[1]);
  const params = new URLSearchParams(window.location.search);
  return params.get("slug") || "leasing-vs-uver";
}

function NotFoundBlock() {
  return (
    <section className="bg-white py-24 px-4 sm:px-6 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900">Článok sme nenašli</h1>
        <p className="mt-3 text-slate-600">Možno bol presunutý alebo zmazaný.</p>
        <a href="/blog" className="inline-flex items-center gap-2 mt-6 text-blue-900 font-semibold underline underline-offset-4 decoration-2 decoration-blue-300 hover:decoration-blue-700">
          <ChevronLeft className="w-4 h-4" />
          Späť na blog
        </a>
      </div>
    </section>
  );
}

function ArticleHeader({ post }) {
  const tagColor = TAG_COLORS[post.tag] || "bg-slate-100 text-slate-800";
  return (
    <header className="bg-gradient-to-br from-slate-50 via-white to-blue-50/40 border-b border-slate-100 px-4 sm:px-6 py-12 sm:py-16">
      <div className="max-w-3xl mx-auto">
        <nav className="text-sm text-slate-500 mb-6 flex items-center gap-2 flex-wrap">
          <a href="/" className="hover:text-blue-900">Domov</a>
          <ChevronRight className="w-3.5 h-3.5" />
          <a href="/blog" className="hover:text-blue-900">Blog</a>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-700 truncate">{post.title}</span>
        </nav>

        <div className={`inline-block px-3 py-1 rounded-full ${tagColor} text-xs font-bold mb-5`}>
          {post.tag}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
          {post.title}
        </h1>

        <p className="mt-5 text-lg text-slate-600 leading-relaxed">{post.excerpt}</p>

        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{post.readTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Redakcia AutoMesacne.sk</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function ArticleCover({ post }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-2">
      <div className={`relative aspect-[16/9] rounded-3xl overflow-hidden shadow-xl`}>
        {post.image ? (
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${post.color} flex items-center justify-center`}>
            {post.isVideo ? (
              <button
                type="button"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/95 hover:bg-white text-blue-900 flex items-center justify-center shadow-2xl transition-all hover:scale-105"
                aria-label="Prehrať video"
              >
                <Play className="w-11 h-11 sm:w-12 sm:h-12 ml-1" />
              </button>
            ) : (
              <Car className="w-32 h-32 text-white/40" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ArticleBody({ post }) {
  const body = BLOG_BODIES[post.slug] || [];
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-16 prose prose-lg prose-slate">
      <div className="space-y-6 text-slate-700 text-lg leading-relaxed">
        {body.map((b, i) => {
          if (b.type === "p") {
            return <p key={i}>{b.text}</p>;
          }
          if (b.type === "h2") {
            return <h2 key={i} className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-10 mb-3">{b.text}</h2>;
          }
          if (b.type === "quote") {
            return (
              <blockquote key={i} className="border-l-4 border-blue-600 pl-6 py-3 my-8 bg-blue-50/50 rounded-r-xl">
                <p className="text-lg italic text-slate-800 font-medium">"{b.text}"</p>
              </blockquote>
            );
          }
          if (b.type === "ul") {
            return (
              <ul key={i} className="space-y-3 list-none pl-0">
                {b.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          }
          return null;
        })}
      </div>

      {/* Inline CTA */}
      <div className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-8 text-center">
        <h3 className="text-2xl font-bold text-slate-900">Chcete si rovno vypočítať splátku?</h3>
        <p className="mt-3 text-slate-600 max-w-xl mx-auto">
          V kalkulačke uvidíte orientačnú splátku za pár sekúnd. Bez registrácie a bez záväzkov.
        </p>
        <a
          href="/#form"
          className="inline-flex items-center gap-2 mt-5 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3.5 rounded-xl transition-colors shadow-lg shadow-green-900/20"
        >
          Otvoriť kalkulačku
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* Share */}
      <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Share2 className="w-4 h-4" />
          <span className="font-semibold">Zdieľať</span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-semibold text-slate-700 transition-colors">
            Facebook
          </button>
          <button type="button" className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-semibold text-slate-700 transition-colors">
            LinkedIn
          </button>
          <button type="button" className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-semibold text-slate-700 transition-colors">
            Kopírovať link
          </button>
        </div>
      </div>
    </article>
  );
}

function RelatedPosts({ currentSlug }) {
  const related = getRelatedPosts(currentSlug, 3);
  return (
    <section className="bg-slate-50 py-16 px-4 sm:px-6 border-t border-slate-100">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-8">Súvisiace články</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {related.map((p) => {
            const tagColor = TAG_COLORS[p.tag] || "bg-slate-100 text-slate-800";
            return (
              <a key={p.slug} href={`/blog-detail?slug=${p.slug}`} className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all overflow-hidden flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden">
                  {p.image ? (
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${p.color} flex items-center justify-center`}>
                      {p.isVideo ? (
                        <div className="w-14 h-14 rounded-full bg-white/95 text-blue-900 flex items-center justify-center">
                          <Play className="w-6 h-6 ml-0.5" />
                        </div>
                      ) : (
                        <Car className="w-14 h-14 text-white/60" />
                      )}
                    </div>
                  )}
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full ${tagColor} text-xs font-bold`}>
                    {p.tag}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 leading-snug group-hover:text-blue-900 transition-colors">
                    {p.title}
                  </h3>
                  <div className="mt-3 text-xs text-slate-500 flex items-center gap-3">
                    <span>{p.date}</span>
                    <span className="text-slate-300">·</span>
                    <span>{p.readTime}</span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BlogDetailApp() {
  const [post, setPost] = useBDState(() => getPostBySlug(getSlugFromURL()));

  useBDEffect(() => {
    if (post?.title) document.title = `${post.title} · AutoMesacne.sk`;
  }, [post]);

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      <SiteNav active="blog" />
      <main>
        {!post ? (
          <NotFoundBlock />
        ) : (
          <>
            <ArticleHeader post={post} />
            <ArticleCover post={post} />
            <ArticleBody post={post} />
            <RelatedPosts currentSlug={post.slug} />
          </>
        )}
      </main>
      <SiteFooter />
      <CallbackWidget />
    </div>
  );
}

const blogDetailRoot = ReactDOM.createRoot(document.getElementById("root"));
blogDetailRoot.render(<BlogDetailApp />);
