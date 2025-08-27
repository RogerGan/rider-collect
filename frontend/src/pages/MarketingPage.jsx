import './marketing.css';

export default function MarketingPage() {
  return (
    <div className="mk-wrap">
      <section className="mk-hero">
        <div className="mk-hero-left">
          <h1>骑手专属通信优惠</h1>
          <p>为外卖骑手提供更稳定、更划算的通信服务。开卡即享专属权益。</p>
          <a href="/" className="mk-cta">立即登记开卡</a>
        </div>
        <div className="mk-hero-right">
          <img src="/assets/hero-rider.svg" alt="骑手形象" />
        </div>
      </section>

      <section className="mk-features">
        <div className="mk-feature">
          <img src="/assets/feature-signal.svg" alt="信号稳定" />
          <h3>信号稳定</h3>
          <p>城市全覆盖，配送不再担心掉线。</p>
        </div>
        <div className="mk-feature">
          <img src="/assets/feature-price.svg" alt="资费优惠" />
          <h3>资费优惠</h3>
          <p>骑手专属套餐，话费更省，流量更足。</p>
        </div>
        <div className="mk-feature">
          <img src="/assets/feature-service.svg" alt="快速服务" />
          <h3>快速服务</h3>
          <p>登记即办，线上提交，最快当天开通。</p>
        </div>
      </section>

      <section className="mk-steps">
        <h2>开卡流程</h2>
        <ol>
          <li>在线提交信息</li>
          <li>客服确认与审核</li>
          <li>线下或邮寄开卡</li>
        </ol>
      </section>
    </div>
  );
}
