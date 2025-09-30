import React, { useEffect } from 'react';

interface SchemaInjectorProps {
  schema: object;
}

const SchemaInjector: React.FC<SchemaInjectorProps> = ({ schema }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      // Clean up the script when the component unmounts
      document.head.removeChild(script);
    };
  }, [schema]); // Rerun effect if schema object changes

  return null; // This component doesn't render anything to the DOM
};

export default SchemaInjector;
