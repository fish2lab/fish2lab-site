'use client';

import React, { type ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { HandTitle, InkFrame, InkRule, PaperSection, RoughBorder } from '../woodcut';
import { StepTitle } from '../artwork/HandMarks';
import Ticket from '../artwork/Ticket';
import styles from './buy.module.css';

export default function BuyPage(): ReactNode {
    // 查询串在水合之后才读：静态 HTML 里没有订单，首帧和服务端输出一致
    const searchParams = useSearchParams();

    const product = searchParams.get('product');
    const variant = searchParams.get('variant');
    const spec = searchParams.get('spec');
    const price = searchParams.get('price');
    // 作品页传来的是数字（68、6.5）；统一写成两位小数，不再在文案里硬拼 .00
    const priceText = price && Number.isFinite(Number(price)) ? Number(price).toFixed(2) : (price ?? '');

    const prefill = product && variant && spec ? { product, variant, spec } : null;

    return (
        <>
<PaperSection tone="wall" width="narrow" space="md" className={styles.page}>
                <HandTitle as="h1" size="title" className={styles.title}>
                    {'奉纳信仰 / OFFER FAITH'}
                </HandTitle>

                {prefill ? (
                    <Ticket
                        className={styles.slip}
                        head={<p className={styles.slipHead}>{'订单'}</p>}
                    >
                        <ul className={`${styles.slipRows} wc-mono`}>
                            <li>{`作品：${prefill.product}`}</li>
                            <li>{`款式：${prefill.variant}`}</li>
                            <li>{`规格：${prefill.spec}`}</li>
                        </ul>
                        {price ? (
                            <p className={`${styles.slipAmount} wc-mono`}>
                                {`待支付金额: ¥ ${priceText}`}
                            </p>
                        ) : null}
                    </Ticket>
                ) : null}

                <section className={styles.step}>
                    <StepTitle text={'1. 扫码支付 / Payment'} />
                    <div className={styles.qrRow}>
                        <InkFrame size="sm" seed={33} nominal={[220, 230]} className={styles.qr} caption={"支付宝 (Alipay)"}>
                            <img
                                src="/images/sukima/shop/alipay_receiveMoney.webp"
                                alt={'Alipay payment QR code'}
                                width={922}
                                height={964}
                                decoding="async"
                            />
                        </InkFrame>
                        <InkFrame size="sm" seed={34} nominal={[220, 230]} className={styles.qr} caption={"微信支付 (WeChat)"}>
                            <img
                                src="/images/sukima/shop/IMG_0944.webp"
                                alt={'WeChat Pay payment QR code'}
                                width={1200}
                                height={1182}
                                decoding="async"
                            />
                        </InkFrame>
                    </div>
                </section>

                <InkRule weight="thin" dry={0.25} seed={101} className={styles.rule} />

                <section className={styles.step}>
                    <StepTitle text={'2. 联系方式 / Contact'} />
                    <p className={styles.para}>{"推荐发邮件给我，使用你的任意邮箱，包括QQ邮箱均可，确认信息和快递单号都会通过邮件回信给出。"}</p>
                    <p className={styles.para}>{"发送购买邮件后，请添加社团交流群。我会以邮件回复确认订单并提供快递运输信息，若遇到问题请邮件联系或在群中发起私聊联系主催。"}</p>
                    <ul className={styles.emails}>
                        <li className={styles.primary}>
                            <RoughBorder variant="line" weight={1.8} amp={0.45} seed={103} nominal={[560, 52]} className={styles.emailEdge} />
                            <span className={styles.emailText}>{"To: fish2lab@gmail.com (推荐/Recommended)"}</span>
                        </li>
                        <li className={styles.secondary}>
                            {"Cc: kanade271828@icloud.com (备选/Backup)"}
                        </li>
                    </ul>
                </section>

                <InkRule weight="thin" dry={0.25} seed={107} className={styles.rule} />

                <section className={styles.step}>
                    <StepTitle text={'3. 邮件填写模板 / Email Template'} />
                    <div className={styles.templateBox} data-wc-tone="paper">
                        <RoughBorder variant="fill" amp={0.9} freq={30} seed={109} nominal={[720, 520]} className={styles.templateEdge} />
                        <span className={styles.copyHint}>{"请复制下方内容 / Copy below"}</span>

                        {prefill ? (
                            <>
                                <p><strong>{"邮件标题："}</strong><>{"【"}{prefill.product}{"购买】你的QQ号 + "}{prefill.spec}</></p>
                                <p><strong>{"邮件正文："}</strong></p>
                                <p>{"购买规格"}</p>
                                <p><>{"作品："}{prefill.product}</></p>
                                <p><>{"款式："}{prefill.variant}</></p>
                                <p><>{"规格："}{prefill.spec}</></p>
                                <p>{"数量：1"}</p>
                                <p>--------------------------------</p>
                                <p>{"收货信息："}</p>
                                <p>{"姓名："}</p>
                                <p>{"电话："}</p>
                                <p>{"地址："}</p>
                            </>
                        ) : (
                            <>
                                <p><strong>{"邮件标题："}</strong>{"【某某制品购买】你的QQ号+尺寸"}</p>
                                <p><strong>{"邮件正文："}</strong></p>
                                <p>{"购买规格"}</p>
                                <p>{"尺寸：（例如：14寸）"}</p>
                                <p>{"样式：（需要留白 / 无边框满印）"}</p>
                                <p>{"数量："}</p>
                                <p>{"收货信息："}</p>
                                <p>{"姓名&联系电话&收货地址"}</p>
                            </>
                        )}

                        <div className={styles.importantNote}>
                            {"* 请务必在邮件附件中上传“付款记录截图”，截图需要能看清“商户单号”或“交易单号”（Order ID），以便主催核对入账。"}
                            <br />
                            {"* 如若选择添加好友私信购买，也请给出上述信息。"}
                        </div>
                    </div>
                </section>

                <p className={styles.signature}>
                    {"Sincerely,"}<br />
                    {"苏心贤 (主催)"}
                </p>
            </PaperSection>
        </>
    );
}
