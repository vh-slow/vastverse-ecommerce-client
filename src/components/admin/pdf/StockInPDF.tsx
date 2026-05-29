import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
} from '@react-pdf/renderer';
import { formatCurrency, formatDateTime } from '@/src/utils/formatters';

Font.register({
    family: 'Roboto',
    fonts: [
        {
            src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
            fontWeight: 'normal',
        },
        {
            src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
            fontWeight: 'bold',
        },
    ],
});

const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: 'Roboto', fontSize: 10, color: '#374151' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: 15,
        marginBottom: 20,
    },
    title: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
    metaText: { fontSize: 10, color: '#6b7280', marginTop: 6 },
    badge: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#15803d',
        border: '1px solid #bbf7d0',
        backgroundColor: '#f0fdf4',
        padding: '4 8',
        borderRadius: 4,
    },
    infoGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    infoBox: {
        width: '30%',
        backgroundColor: '#f9fafb',
        padding: 10,
        borderRadius: 6,
        border: '1px solid #f3f4f6',
    },
    infoLabel: { fontSize: 9, color: '#6b7280', marginBottom: 4 },
    infoValue: { fontSize: 11, fontWeight: 'bold', color: '#1f2937' },
    tableHeader: {
        flexDirection: 'row',
        borderBottom: '1px solid #e5e7eb',
        borderTop: '1px solid #e5e7eb',
        paddingVertical: 8,
        fontWeight: 'bold',
        fontSize: 9,
        color: '#6b7280',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '1px solid #f3f4f6',
        paddingVertical: 10,
    },
    colStt: { width: '5%', textAlign: 'center' },
    colProduct: { width: '45%', paddingRight: 10 },
    colQty: { width: '10%', textAlign: 'center' },
    colPrice: { width: '20%', textAlign: 'right' },
    colTotal: { width: '20%', textAlign: 'right' },
    productName: { fontWeight: 'bold', color: '#111827', marginBottom: 3 },
    productSku: { fontSize: 8, color: '#6b7280' },
    totalRow: { flexDirection: 'row', marginTop: 15, paddingTop: 10 },
    totalLabel: {
        width: '80%',
        textAlign: 'right',
        fontWeight: 'bold',
        paddingRight: 10,
        fontSize: 11,
    },
    totalValue: {
        width: '20%',
        textAlign: 'right',
        fontWeight: 'bold',
        fontSize: 13,
        color: '#2563eb',
    },
});

const StockInPDF = ({ stockIn }: { stockIn: any }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>CHI TIẾT PHIẾU NHẬP KHO</Text>
                    <Text style={styles.metaText}>
                        Mã phiếu: #{stockIn.id} | Ngày nhập:{' '}
                        {formatDateTime(stockIn.createdAt)}
                    </Text>
                </View>
                <View>
                    <Text style={styles.badge}>ĐÃ NHẬP KHO</Text>
                </View>
            </View>

            <View style={styles.infoGrid}>
                <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>Nhà cung cấp:</Text>
                    <Text style={styles.infoValue}>{stockIn.supplierName}</Text>
                </View>
                <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>Người lập phiếu:</Text>
                    <Text style={styles.infoValue}>{stockIn.creatorName}</Text>
                </View>
                <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>Ghi chú:</Text>
                    <Text style={{ ...styles.infoValue, fontWeight: 'normal' }}>
                        {stockIn.note || 'Không có'}
                    </Text>
                </View>
            </View>

            <Text
                style={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    marginBottom: 10,
                    color: '#111827',
                }}
            >
                Chi Tiết Hàng Hóa
            </Text>

            <View>
                <View style={styles.tableHeader}>
                    <Text style={styles.colStt}>STT</Text>
                    <Text style={styles.colProduct}>SẢN PHẨM</Text>
                    <Text style={styles.colQty}>SỐ LƯỢNG</Text>
                    <Text style={styles.colPrice}>GIÁ NHẬP (VNĐ)</Text>
                    <Text style={styles.colTotal}>THÀNH TIỀN</Text>
                </View>

                {stockIn.items.map((item: any, idx: number) => (
                    <View key={item.productVariantId} style={styles.tableRow}>
                        <Text style={styles.colStt}>{idx + 1}</Text>
                        <View style={styles.colProduct}>
                            <Text style={styles.productName}>
                                {item.productName}
                            </Text>
                            <Text style={styles.productSku}>
                                SKU: {item.sku}
                            </Text>
                        </View>
                        <Text style={styles.colQty}>{item.quantity}</Text>
                        <Text style={styles.colPrice}>
                            {formatCurrency(item.importPrice)}
                        </Text>
                        <Text style={styles.colTotal}>
                            {formatCurrency(item.subtotal)}
                        </Text>
                    </View>
                ))}

                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>TỔNG TIỀN PHIẾU NHẬP:</Text>
                    <Text style={styles.totalValue}>
                        {formatCurrency(stockIn.totalAmount)}
                    </Text>
                </View>
            </View>
        </Page>
    </Document>
);

export default StockInPDF;
