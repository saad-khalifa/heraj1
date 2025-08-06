import React from 'react';
import Footer from './Footer';

const About = () => {
  return (
    <div className="container mt-5 mb-5">
      <h1 className="text-center mb-4">من نحن</h1>

      <p>
        <strong>حراج سوريا</strong> هو منصة إلكترونية سورية شاملة، تهدف إلى تسهيل عمليات البيع والشراء والخدمات بين الأفراد والشركات في جميع المحافظات السورية. نقدم مساحة آمنة وسريعة لنشر الإعلانات، التواصل بين البائعين والمشترين، وعرض الخدمات بكل سهولة.
      </p>

      <h3 className="mt-4">رسالتنا</h3>
      <p>
        نسعى لتمكين الأفراد من الإعلان والتسويق لخدماتهم ومنتجاتهم بطريقة موثوقة وفعالة، مع التركيز على البساطة، وسهولة الاستخدام، والوصول إلى جمهور واسع.
      </p>

      <h3 className="mt-4">رؤيتنا</h3>
      <p>
        أن نصبح المنصة الأولى في سوريا للإعلانات المبوبة والخدمات، وأن نساهم في دعم الاقتصاد المحلي عبر تمكين أصحاب الأعمال والمشاريع الصغيرة من الوصول إلى عملائهم.
      </p>

      <h3 className="mt-4">الخدمات التي نقدمها</h3>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">🛒 نشر الإعلانات المبوبة في كافة الفئات (عقارات، سيارات، وظائف، خدمات...)</li>
        <li className="list-group-item">📍 دعم جميع المحافظات والمدن السورية</li>
        <li className="list-group-item">🔐 حسابات مخصصة للمستخدمين مع إمكانية إدارة الإعلانات والمفضلة</li>
        <li className="list-group-item">💬 نظام رسائل داخلي للتواصل بين البائع والمشتري</li>
        <li className="list-group-item">📣 إمكانية تقديم الشكاوى والتقارير</li>
        <li className="list-group-item">📨 نظام تواصل مع الإدارة (تذاكر دعم)</li>
        <li className="list-group-item">📊 لوحة تحكم للإدارة لإدارة الموقع والمحتوى</li>
        <li className="list-group-item">💰 نظام دفع إلكتروني لإعلانات مميزة (قريبًا)</li>
      </ul>

      <h3 className="mt-4">لماذا تختار حراج سوريا؟</h3>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">✅ سهل الاستخدام على الجوال والحاسوب</li>
        <li className="list-group-item">✅ واجهة عربية بالكامل ومريحة للمستخدم</li>
        <li className="list-group-item">✅ آمن، ويدار من قبل فريق موثوق</li>
        <li className="list-group-item">✅ دعم مستمر وتحديثات دورية</li>
      </ul>

      <p className="mt-4">
        شكرًا لثقتكم بنا، ونأمل أن نقدم لكم دائمًا تجربة استخدام مميزة تساعدكم على تحقيق أهدافكم بأسرع وأبسط طريقة.
      </p>
      <Footer/>
    </div>
  );
};

export default About;
