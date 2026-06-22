import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as store from '../data/store'

export default function Articles() {
  const [articles, setArticles] = useState(() => store.getAll('blogs'))
  useEffect(() => store.subscribe(() => setArticles(store.getAll('blogs'))), [])

  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, #0A1F3D 0%, #0072CE 100%)', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'rgba(232,25,44,0.25)', color: '#E8192C', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', marginBottom: '20px' }}>INSIGHTS & ARTICLES</div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: '900', fontFamily: 'Montserrat, sans-serif', color: 'white', marginBottom: '16px' }}>
          Latest Insights
        </h1>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', maxWidth: '540px', margin: '0 auto', lineHeight: 1.7 }}>
          Expert perspectives on enterprise technology, digital transformation, and industry trends.
        </p>
      </section>

      <section style={{ background: '#F5F6F8', padding: '72px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '28px' }}>
            {articles.map((a) => <ArticleCard key={a.id} a={a} />)}
          </div>
        </div>
      </section>
    </div>
  )
}

function ArticleCard({ a }) {
  return (
    <div style={{ background: 'white', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 14px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', borderTop: `4px solid ${a.borderColor}` }}>
      <div style={{ padding: '28px 28px 24px' }}>
        <span style={{ background: `${a.categoryColor}15`, color: a.categoryColor, padding: '4px 12px', borderRadius: '14px', fontSize: '11px', fontWeight: '700', display: 'inline-block', marginBottom: '16px' }}>
          {a.category}
        </span>
        <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0A1F3D', lineHeight: 1.4, marginBottom: '14px', fontFamily: 'Montserrat, sans-serif' }}>{a.title}</h3>
        <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.75 }}>{a.excerpt}</p>
      </div>
      <div style={{ padding: '16px 28px', borderTop: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: '#0A1F3D', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>{a.author.charAt(0)}</div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#333' }}>{a.author}</div>
            <div style={{ fontSize: '11px', color: '#aaa' }}>{a.date}</div>
          </div>
        </div>
        <span style={{ fontSize: '11px', color: '#aaa', background: '#f5f5f5', padding: '3px 10px', borderRadius: '10px' }}>{a.readTime}</span>
      </div>
    </div>
  )
}
