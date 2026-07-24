const fs = require('fs');
let content = fs.readFileSync('src/i18n/index.ts', 'utf8');

const arSection = content.indexOf('ar: {');
const statsSection = content.indexOf('// الإحصائيات', arSection);

if (statsSection > -1) {
  const insertText = `
      // Notifications
      notifications: 'الإشعارات',
      markAllAsRead: 'تحديد الكل كمقروء',
      noNewNotifications: 'لا توجد إشعارات جديدة',
      viewAllNotifications: 'عرض كل الإشعارات',
`;
  content = content.slice(0, statsSection) + insertText + content.slice(statsSection);
  fs.writeFileSync('src/i18n/index.ts', content);
  console.log("Success");
} else {
  console.log("Not found");
}
