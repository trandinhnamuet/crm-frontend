import { Card, Space } from 'antd';
import type { ReactNode } from 'react';

export interface CardListField<T> {
  label: string;
  render: (item: T) => ReactNode;
}

export interface CardListProps<T> {
  data: T[];
  fields: CardListField<T>[];
  actions?: (item: T) => ReactNode;
  cardProps?: (item: T) => object;
  emptyText?: ReactNode;
}

export function CardList<T extends { id: string | number }>({
  data,
  fields,
  actions,
  cardProps,
  emptyText,
}: CardListProps<T>) {
  if (!data || data.length === 0) {
    return <div style={{ textAlign: 'center', color: '#888', padding: 24 }}>{emptyText || 'Không có dữ liệu'}</div>;
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {data.map((item) => {
        const extraProps = cardProps ? cardProps(item) : {};
        const { style: extraStyle, ...otherProps } = extraProps as any;
        return (
          <Card
            key={item.id}
            size="small"
            bordered={false}
            style={{
              marginBottom: 0,
              borderRadius: 14,
              boxShadow: '0 2px 8px 0 rgba(31, 41, 55, 0.06)',
              border: '1px solid #e5e7eb',
              padding: 0,
              overflow: 'hidden',
              ...extraStyle,
            }}
            bodyStyle={{ padding: 0 }}
            {...otherProps}
          >
            <div style={{ padding: '12px 16px 0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 600, fontSize: 15, letterSpacing: 0.5 }}>{fields[0].render(item)}</div>
              {actions && (
                <Space size={0} style={{ gap: 8 }}>
                  {actions(item)}
                </Space>
              )}
            </div>
            <div style={{ padding: '0 16px 12px 16px' }}>
              {fields.slice(1).map((f, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 13,
                    padding: '8px 0',
                    color: '#222',
                  }}
                >
                  <span style={{ minWidth: 110, color: '#888', fontSize: 12 }}>{f.label}</span>
                  <span style={{ fontWeight: 500, marginLeft: 8 }}>{f.render(item)}</span>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export default CardList;
