import { motion } from 'framer-motion';
import logoAmapola from '@/assets/logo-amapola.avif';

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

const PageHeader = ({ title, subtitle, children }: PageHeaderProps) => {
  return (
    <div className="sticky top-0 z-20 bg-background/95 px-4 pb-3 pt-4 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <motion.img
            src={logoAmapola}
            alt="Amapola Market"
            className="h-7 w-auto object-contain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          {title && (
            <div>
              <h1 className="text-lg font-semibold text-foreground leading-tight">{title}</h1>
              {subtitle && <p className="text-[11px] text-muted-foreground">{subtitle}</p>}
            </div>
          )}
        </div>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
