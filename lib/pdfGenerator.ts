/**
 * وحدة لإنشاء ملفات PDF باستخدام قدرات المتصفح الأصلية
 */

export interface PdfGeneratorOptions {
    title: string;
    filename?: string;
    orientation?: 'portrait' | 'landscape';
    pageSize?: 'A4' | 'Letter';
    extraHtml?: string;
}

export interface TableColumn {
    header: string;
    accessor: string;
    render?: (value: any, row: any) => string;
}

/**
 * دالة لإنشاء تقرير PDF من بيانات الجدول
 */
export const generateTablePdf = (
    data: any[],
    columns: TableColumn[],
    options: PdfGeneratorOptions
) => {
    const { title, filename = 'report.pdf', orientation = 'portrait', pageSize = 'A4' } = options;

    // إنشاء عنصر HTML مؤقت لتحويله إلى PDF
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('يرجى السماح بالنوافذ المنبثقة لإنشاء التقرير');
        return;
    }

    // تحديد أبعاد الصفحة
    const pageWidth = pageSize === 'A4' ? '210mm' : '215.9mm';
    const pageHeight = pageSize === 'A4' ? '297mm' : '279.4mm';

    // إنشاء محتوى HTML للتقرير
    const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <title>${title}</title>
      <meta charset="utf-8" />
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          direction: rtl;
        }
        @page {
          size: ${pageSize} ${orientation};
          margin: 1cm;
        }
        .report-header {
          text-align: center;
          margin-bottom: 20px;
        }
        .report-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .report-date {
          font-size: 14px;
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px 12px;
          text-align: right;
        }
        th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          margin-top: 30px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="report-header">
        <div class="report-title">${title}</div>
        <div class="report-date">تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}</div>
      </div>
      
      ${options.extraHtml || ''}
      
      <table>
        <thead>
          <tr>
            ${columns.map(column => `<th>${column.header}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              ${columns.map(column => {
        const value = row[column.accessor];
        return `<td>${column.render ? column.render(value, row) : value || ''}</td>`;
    }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="footer">
        <p>تم إنشاء هذا التقرير بواسطة نظام Glintup - ${new Date().toLocaleString('ar-EG')}</p>
      </div>
      
      <script>
        window.onload = function() {
          setTimeout(() => {
            window.print();
            setTimeout(() => window.close(), 500);
          }, 500);
        };
      </script>
    </body>
    </html>
  `;

    // كتابة المحتوى في النافذة الجديدة
    printWindow.document.write(htmlContent);
    printWindow.document.close();
};

/**
 * دالة لإنشاء تقرير شهري للحجوزات
 */
export const generateMonthlyBookingReport = (
    bookings: any[],
    month?: Date,
    title?: string
) => {
    const reportDate = month || new Date();
    const monthName = reportDate.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' });
    const reportTitle = title || `تقرير الحجوزات الشهري - ${monthName}`;

    // حساب إحصائيات التقرير
    const totalBookings = bookings.length;
    const statusCounts = bookings.reduce((acc: Record<string, number>, booking) => {
        const status = booking.status || 'unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    // تعريف أعمدة التقرير
    const columns: TableColumn[] = [
        { header: 'رقم الحجز', accessor: 'code' },
        { header: 'العميل', accessor: 'user', render: (_, row) => row.user?.full_name || '' },
        { header: 'رقم الهاتف', accessor: 'user', render: (_, row) => row.user?.full_phone || '' },
        { header: 'الصالون', accessor: 'salon', render: (_, row) => row.salon?.merchant_commercial_name || '' },
        { header: 'التاريخ', accessor: 'date', render: (value) => new Date(value).toLocaleDateString('ar-EG') },
        { header: 'الوقت', accessor: 'time', render: (time, row) => `${time} - ${row.end_time}` },
        {
            header: 'الخدمات', accessor: 'booking_services', render: (services) => {
                if (!services || !services.length) return '';
                return services.map((s: any) => s.service?.name?.ar).join('، ');
            }
        },
        {
            header: 'الحالة', accessor: 'status', render: (status) => {
                switch (status) {
                    case 'confirmed': return 'مؤكد';
                    case 'pending': return 'معلق';
                    case 'cancelled': return 'ملغي';
                    case 'completed': return 'مكتمل';
                    default: return status;
                }
            }
        }
    ];

    // إنشاء محتوى HTML إضافي للإحصائيات
    const statsHtml = `
    <div style="margin-bottom: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
      <h3 style="margin-top: 0; margin-bottom: 10px;">ملخص الإحصائيات</h3>
      <div style="display: flex; flex-wrap: wrap; gap: 20px;">
        <div style="flex: 1; min-width: 150px;">
          <div style="font-weight: bold; font-size: 16px;">إجمالي الحجوزات</div>
          <div style="font-size: 24px; color: #333;">${totalBookings}</div>
        </div>
        ${statusCounts.confirmed ? `
        <div style="flex: 1; min-width: 150px;">
          <div style="font-weight: bold; font-size: 16px;">الحجوزات المؤكدة</div>
          <div style="font-size: 24px; color: #22c55e;">${statusCounts.confirmed || 0}</div>
        </div>` : ''}
        ${statusCounts.pending ? `
        <div style="flex: 1; min-width: 150px;">
          <div style="font-weight: bold; font-size: 16px;">الحجوزات المعلقة</div>
          <div style="font-size: 24px; color: #f59e0b;">${statusCounts.pending || 0}</div>
        </div>` : ''}
        ${statusCounts.completed ? `
        <div style="flex: 1; min-width: 150px;">
          <div style="font-weight: bold; font-size: 16px;">الحجوزات المكتملة</div>
          <div style="font-size: 24px; color: #3b82f6;">${statusCounts.completed || 0}</div>
        </div>` : ''}
        ${statusCounts.cancelled ? `
        <div style="flex: 1; min-width: 150px;">
          <div style="font-weight: bold; font-size: 16px;">الحجوزات الملغاة</div>
          <div style="font-size: 24px; color: #ef4444;">${statusCounts.cancelled || 0}</div>
        </div>` : ''}
      </div>
    </div>
  `;

    // إنشاء التقرير
    generateTablePdf(bookings, columns, {
        title: reportTitle,
        filename: `bookings-report-${reportDate.getFullYear()}-${reportDate.getMonth() + 1}.pdf`,
        orientation: 'landscape',
        pageSize: 'A4',
        extraHtml: statsHtml
    });

};