import { useHeaderStore } from '@/store/headerStore';

export default function Header() {
  const { title, subtitle } = useHeaderStore();

  return (
    <header 
      className="text-white flex items-center"
      style={{ 
        backgroundColor: 'var(--primary-color)',
        paddingLeft: '3rem',
        paddingRight: '2rem',
        height: '80px'
      }}
    >
      <div className="flex-1">
        <h1 
          className="mb-1"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            fontSize: '26px',
            lineHeight: '1.2'
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p 
            className="text-white/90"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '18px',
              fontWeight: 400,
              lineHeight: '1.4'
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}