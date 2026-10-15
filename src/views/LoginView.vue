<template>
  <div class="login" :class="{ 'is-in': inited }">
    <!-- ===== 左侧品牌展示区 ===== -->
    <aside class="login__brand">
      <div class="login__deco" aria-hidden="true">
        <span class="deco-glow deco-glow--1" />
        <span class="deco-glow deco-glow--2" />
        <span class="deco-chip deco-chip--1" />
        <span class="deco-chip deco-chip--2" />
        <span class="deco-chip deco-chip--3" />

        <svg class="deco-bowl" viewBox="0 0 360 300" preserveAspectRatio="xMidYMax meet">
          <path d="M30 150 Q180 330 330 150 Z" fill="rgba(255,255,255,0.05)" />
          <ellipse cx="180" cy="150" rx="150" ry="32" fill="rgba(255,255,255,0.09)" />
          <ellipse cx="180" cy="150" rx="126" ry="22" fill="rgba(0,0,0,0.10)" />
        </svg>

        <svg class="deco-steam" viewBox="0 0 360 300" preserveAspectRatio="xMidYMax meet">
          <g class="deco-steam__wisp" style="--d: 0s">
            <path d="M150 138 C140 108 162 88 150 56" />
          </g>
          <g class="deco-steam__wisp" style="--d: .6s">
            <path d="M182 144 C172 110 196 86 182 52" />
          </g>
          <g class="deco-steam__wisp" style="--d: 1.1s">
            <path d="M214 138 C204 108 226 88 214 56" />
          </g>
        </svg>
      </div>

      <div class="login__brand-inner">
        <brand-logo variant="full" :tagline="true" inverse animated class="login__logo" />

        <div class="login__slogan">
          <h1>发现附近的好味道</h1>
          <p>品类齐全 · 极速配送 · 品质保障</p>
        </div>

        <ul class="login__points">
          <li><icon-img class="point-icon" name="fujinshangjia" size="lg" /> 万家精选商家，一键直达</li>
          <li><icon-img class="point-icon" name="sousuo" size="lg" /> 智能推荐，懂你的胃口</li>
          <li><icon-img class="point-icon" name="jisupeisong" size="lg" /> 实时追踪，热乎送达</li>
        </ul>

        <p class="login__brand-foot">知味 v1.0 · 让好味道触手可及</p>
      </div>
    </aside>

    <!-- ===== 右侧登录表单区 ===== -->
    <main class="login__panel">
      <button
        type="button"
        class="login__back"
        aria-label="返回首页"
        title="返回首页"
        @click="$router.replace('/home')"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        <span>返回</span>
      </button>

      <div class="login__card" :class="{ 'is-shake': boxShake }">
        <header class="login__head">
          <h2 class="login__welcome">欢迎回来</h2>
          <p class="login__sub">登录知味，开启你的美食之旅</p>
        </header>

        <!-- 登录方式切换 -->
        <div class="login-tabs" role="tablist">
          <button
            class="login-tabs__btn"
            role="tab"
            :aria-selected="mode === 'pwd'"
            :class="{ 'is-active': mode === 'pwd' }"
            @click="switchMode('pwd')"
          >账号登录</button>
          <button
            class="login-tabs__btn"
            role="tab"
            :aria-selected="mode === 'sms'"
            :class="{ 'is-active': mode === 'sms' }"
            @click="switchMode('sms')"
          >短信登录</button>
          <span class="login-tabs__indicator" :class="`login-tabs__indicator--${mode}`" aria-hidden="true" />
        </div>

        <!-- 表单主体（按模式切换并淡入淡出） -->
        <transition name="form-swap" mode="out-in">
          <!-- 账号登录 -->
          <form v-if="mode === 'pwd'" key="pwd" class="login-form" @submit.prevent="onSubmit" novalidate>
            <auth-field
              v-model="pwd.username" label="账号" autocomplete="username"
              :error="errors.username"
              style="--d: 0"
            >
              <template #icon>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke-linecap="round" />
                </svg>
              </template>
            </auth-field>

            <auth-field
              v-model="pwd.password" label="密码" type="password" autocomplete="current-password"
              :error="errors.password"
              style="--d: 1"
            >
              <template #icon>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8">
                  <rect x="5" y="10" width="14" height="10" rx="2.5" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke-linecap="round" />
                </svg>
              </template>
            </auth-field>

            <auth-field
              v-model="pwd.captcha" label="验证码" maxlength="4" inputmode="numeric"
              :error="errors.captcha"
              style="--d: 2"
            >
              <template #icon>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M4 7h16M4 12h10M4 17h13" stroke-linecap="round" />
                </svg>
              </template>
              <template #trailing>
                <button type="button" class="captcha-code" @click="refreshCaptcha">
                  <span class="captcha-code__text" :key="captchaKey">{{ captchaText }}</span>
                </button>
              </template>
            </auth-field>

            <div class="login-row" style="--d: 3">
              <label class="login-remember" :class="{ 'is-on': remember }">
                <input type="checkbox" v-model="remember" />
                <span class="login-remember__box" aria-hidden="true">
                  <svg viewBox="0 0 16 16" width="12" height="12"><path d="M3 8l3.5 3.5L13 4.5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </span>
                <span>记住我</span>
              </label>
              <router-link to="/forget" class="login-link">忘记密码？</router-link>
            </div>

            <submit-button
              :state="submitState" :text="submitText" :success-text="'登录成功'" style="--d: 4"
              @click="onSubmit"
            />
            <p class="login__hint" style="--d: 5">演示账号：任意账号 + 至少 6 位密码 + 正确验证码即可登录</p>
          </form>

          <!-- 短信登录 -->
          <form v-else key="sms" class="login-form" @submit.prevent="onSubmit" novalidate>
            <auth-field
              v-model="sms.mobile" label="手机号" type="tel" maxlength="11" inputmode="numeric"
              autocomplete="tel" :error="errors.mobile"
              style="--d: 0"
            >
              <template #icon>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8">
                  <rect x="6" y="3" width="12" height="18" rx="3" />
                  <path d="M10 18h4" stroke-linecap="round" />
                </svg>
              </template>
            </auth-field>

            <auth-field
              v-model="sms.code" label="验证码" maxlength="6" inputmode="numeric"
              :error="errors.code"
              style="--d: 1"
            >
              <template #icon>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M4 7h16M4 12h10M4 17h13" stroke-linecap="round" />
                </svg>
              </template>
              <template #trailing>
                <button
                  type="button"
                  class="sms-code"
                  :class="{ 'is-counting': counting > 0 }"
                  :disabled="counting > 0"
                  @click="sendCode"
                >
                  <span v-if="counting > 0" class="sms-code__num">{{ counting }}s</span>
                  <span v-else>获取验证码</span>
                </button>
              </template>
            </auth-field>

            <transition name="tip-fade">
              <p v-if="smsTip" class="login__tip">模拟验证码：<b>{{ smsTip }}</b></p>
            </transition>

            <submit-button
              :state="submitState" :text="'登录 / 注册'" :success-text="'登录成功'" style="--d: 2"
              @click="onSubmit"
            />
            <p class="login__hint" style="--d: 3">未注册的手机号将自动创建账号</p>
          </form>
        </transition>

        <!-- 全局错误条 -->
        <transition name="banner">
          <div v-if="formError" class="login-banner" role="alert">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="12" cy="12" r="9" /><path d="M12 7v6M12 16.5v.5" stroke-linecap="round" />
            </svg>
            <span>{{ formError }}</span>
          </div>
        </transition>

        <!-- 其他登录方式 -->
        <div class="login-social">
          <span class="login-social__label">其他登录方式</span>
          <div class="login-social__row">
            <button type="button" class="social-btn social-btn--wechat" title="微信登录" @click="social('微信')">
              <icon-img name="weixin" size="xl" />
            </button>
            <button type="button" class="social-btn social-btn--qq" title="QQ 登录" @click="social('QQ')">
              <icon-img name="QQ" size="xl" />
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- ===== 登录成功覆盖层 ===== -->
    <transition name="success">
      <div v-if="showSuccess" class="login-success" role="status" aria-live="polite">
        <div class="login-success__card">
          <svg class="login-success__check" viewBox="0 0 68 68">
            <circle class="sc-circle" cx="34" cy="34" r="30" fill="none" stroke="#16a34a" stroke-width="3" />
            <path class="sc-tick" d="M22 35l8 8 16-18" fill="none" stroke="#16a34a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <p>登录成功</p>
          <span>正在为你跳转…</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import router from '@/router'
import store from '@/stores'
import { accountApi } from '@/api/modules/account'
import { isPhone, isSmsCode, minLen } from '@/utils/validators'
import BrandLogo from '@/components/base/BrandLogo.vue'
import AuthField from '@/components/base/AuthField.vue'
import SubmitButton from '@/components/base/SubmitButton.vue'
import IconImg from '@/components/base/IconImg.vue'

export default {
  name: 'LoginView',
  components: { BrandLogo, AuthField, SubmitButton, IconImg },
  data() {
    return {
      inited: false,
      mode: 'pwd',
      pwd: { username: '', password: '', captcha: '' },
      sms: { mobile: '', code: '' },
      captcha: null,
      captchaKey: 0,
      smsTip: '',
      counting: 0,
      remember: false,
      submitState: 'idle', // idle | loading | success | error
      formError: '',
      boxShake: false,
      showSuccess: false,
      errors: {}
    }
  },
  computed: {
    captchaText() {
      return this.captcha ? this.captcha.code : '获取'
    },
    submitText() {
      return this.mode === 'pwd' ? '登 录' : '登 录 / 注 册'
    }
  },
  mounted() {
    this.refreshCaptcha()
    // 触发入场动画
    requestAnimationFrame(() => {
      setTimeout(() => { this.inited = true }, 40)
    })
  },
  methods: {
    back() {
      if (window.history.length > 1) this.$router.back()
      else this.$router.replace('/home')
    },
    switchMode(m) {
      if (this.mode === m) return
      this.mode = m
      this.errors = {}
      this.formError = ''
    },
    async refreshCaptcha() {
      this.captchaKey += 1
      try {
        this.captcha = await accountApi.captcha()
      } catch {
        this.$toast('验证码获取失败')
      }
    },
    shake() {
      this.boxShake = true
      this.formError = this.formError || '请检查表单填写'
      setTimeout(() => { this.boxShake = false }, 600)
    },
    validatePwd() {
      const e = {}
      if (!this.pwd.username.trim()) e.username = '请输入账号'
      if (!minLen(this.pwd.password, 6)) e.password = '密码至少 6 位'
      if (this.pwd.captcha.trim().length !== 4) e.captcha = '请输入 4 位验证码'
      this.errors = e
      return Object.keys(e).length === 0
    },
    validateSms() {
      const e = {}
      if (!isPhone(this.sms.mobile)) e.mobile = '请输入正确的手机号'
      if (!isSmsCode(this.sms.code)) e.code = '请输入正确的验证码'
      this.errors = e
      return Object.keys(e).length === 0
    },
    async onSubmit() {
      if (this.submitState === 'loading') return
      if (this.mode === 'pwd') {
        if (!this.validatePwd()) return this.shake()
        this.runLogin(() => store.dispatch('user/loginWithPassword', {
          username: this.pwd.username.trim(),
          password: this.pwd.password,
          captchaCode: this.pwd.captcha.trim()
        }))
      } else {
        if (!this.validateSms()) return this.shake()
        this.runLogin(() => store.dispatch('user/loginWithMobile', {
          mobile: this.sms.mobile.trim(),
          code: this.sms.code.trim()
        }))
      }
    },
    async runLogin(apiCall) {
      this.submitState = 'loading'
      this.formError = ''
      try {
        await apiCall()
        this.submitState = 'success'
        this.showSuccess = true
        setTimeout(() => this.back(), 1150)
      } catch (err) {
        this.submitState = 'error'
        this.formError = err.message || '登录失败，请重试'
        this.shake()
        this.$toast(this.formError, 'error')
        setTimeout(() => {
          if (this.submitState === 'error') this.submitState = 'idle'
        }, 1400)
      }
    },
    async sendCode() {
      if (!isPhone(this.sms.mobile)) {
        this.errors = { ...this.errors, mobile: '请输入正确的手机号' }
        return
      }
      this.errors = { ...this.errors, mobile: '' }
      try {
        const res = await accountApi.smsCode(this.sms.mobile.trim())
        this.smsTip = res && res.mockCode ? res.mockCode : ''
        this.$toast('验证码已发送', 'success')
        this.counting = 60
        const t = setInterval(() => {
          this.counting -= 1
          if (this.counting <= 0) clearInterval(t)
        }, 1000)
      } catch (err) {
        this.$toast(err.message || '发送失败', 'error')
      }
    },
    social(name) {
      this.$toast(`演示环境暂不支持${name}登录`, 'info')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.login {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  background: $bg-page;
  overflow: hidden;
}

// ===== 左侧品牌区（暖色“灶火”渐变）=====
.login__brand {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 64px 56px;
  color: #fff;
  overflow: hidden;
  background:
    radial-gradient(120% 120% at 82% 4%, rgba(255, 176, 39, 0.30), transparent 52%),
    radial-gradient(95% 95% at 8% 100%, rgba(255, 83, 57, 0.55), transparent 60%),
    linear-gradient(158deg, #2a120c 0%, #6e1f12 46%, #b8331a 100%);
}

.login__deco {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.deco-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.55;
  &--1 { width: 320px; height: 320px; top: -80px; right: -60px; background: rgba(255, 176, 39, 0.45); }
  &--2 { width: 380px; height: 380px; bottom: -120px; left: -100px; background: rgba(255, 83, 57, 0.4); }
}
.deco-chip {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.18);
  &--1 { width: 54px; height: 54px; top: 22%; left: 14%; animation: chip-bob 7s ease-in-out infinite; }
  &--2 { width: 30px; height: 30px; top: 38%; right: 18%; animation: chip-bob 9s ease-in-out infinite 1s; }
  &--3 { width: 18px; height: 18px; bottom: 26%; left: 30%; animation: chip-bob 6s ease-in-out infinite .5s; }
}
.deco-bowl {
  position: absolute;
  right: -40px;
  bottom: -30px;
  width: 62%;
  height: auto;
  opacity: 0.9;
}
.deco-steam {
  position: absolute;
  right: 60px;
  bottom: 60px;
  width: 46%;
  height: auto;
  path {
    fill: none;
    stroke: rgba(255, 255, 255, 0.55);
    stroke-width: 6;
    stroke-linecap: round;
  }
}
.deco-steam__wisp {
  transform-origin: 50% 100%;
  animation: steam-rise 3.4s ease-in-out infinite;
  animation-delay: var(--d);
}
@keyframes steam-rise {
  0% { opacity: 0; transform: translateY(14px) scaleY(0.9); }
  35% { opacity: 0.7; }
  70% { opacity: 0.45; }
  100% { opacity: 0; transform: translateY(-26px) scaleY(1.08); }
}
@keyframes chip-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

.login__brand-inner {
  position: relative;
  z-index: 2;
  max-width: 440px;
}
.login__logo { margin-bottom: 40px; }
.login__slogan {
  h1 {
    @include sc(34, #fff);
    font-weight: 800;
    line-height: 1.25;
    letter-spacing: 1px;
  }
  p {
    margin-top: 14px;
    @include sc(15, rgba(255, 255, 255, 0.82));
    letter-spacing: 1px;
  }
}
.login__points {
  margin: 36px 0 0;
  padding: 0;
  list-style: none;
  li {
    display: flex;
    align-items: center;
    gap: 12px;
    @include sc(14, rgba(255, 255, 255, 0.9));
    margin-bottom: 16px;
  }
  .point-icon {
    @include wh(24, 24);
    flex-shrink: 0;
    // 将彩色图标统一为白色，与深色品牌区协调
    filter: brightness(0) invert(1) drop-shadow(0 0 8px rgba(255, 176, 39, 0.35));
  }
}
.login__brand-foot {
  margin-top: 48px;
  @include sc(12, rgba(255, 255, 255, 0.5));
}

// ===== 右侧表单区 =====
.login__panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  position: relative;
  background:
    radial-gradient(80% 60% at 50% 0%, rgba(255, 83, 57, 0.06), transparent 60%),
    $bg-page;
}
.login__back {
  position: absolute;
  top: 24px;
  left: 24px;
  z-index: 10;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px 9px 12px;
  border-radius: $radius-pill;
  background: $bg-card;
  border: 1px solid $border-color;
  box-shadow: $shadow-card;
  @include sc(14, $text-body);
  font-weight: 500;
  transition: transform $transition, box-shadow $transition, border-color $transition, color $transition;
  &:hover {
    transform: translateX(-2px);
    border-color: $color-primary;
    color: $color-primary;
    box-shadow: $shadow-card-hover;
  }
  &:active {
    transform: translateX(0);
  }
}
.login__card {
  width: 100%;
  max-width: 400px;
}
.login__card.is-shake {
  animation: card-shake 0.5s cubic-bezier(.36,.07,.19,.97);
}
@keyframes card-shake {
  10%, 90% { transform: translateX(-2px); }
  20%, 80% { transform: translateX(4px); }
  30%, 50%, 70% { transform: translateX(-7px); }
  40%, 60% { transform: translateX(7px); }
}

.login__head {
  margin-bottom: 28px;
  text-align: center;
}
.login__welcome {
  @include sc(26, $text-title);
  font-weight: 800;
  letter-spacing: 1px;
}
.login__sub {
  margin-top: 8px;
  @include sc(14, $text-secondary);
}

// 登录方式切换
.login-tabs {
  position: relative;
  display: flex;
  margin-bottom: 24px;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $radius-pill;
  padding: 5px;
  box-shadow: $shadow-card;
  button {
    position: relative;
    z-index: 2;
    flex: 1;
    padding: 10px 0;
    @include sc(14, $text-body);
    border-radius: $radius-pill;
    transition: color $transition;
    &:hover { color: $text-title; }
    &.is-active { color: #fff; font-weight: 600; }
  }
}
.login-tabs__indicator {
  position: absolute;
  z-index: 1;
  top: 5px;
  bottom: 5px;
  width: calc(50% - 5px);
  border-radius: $radius-pill;
  background: linear-gradient(135deg, $color-primary, $color-primary-600);
  box-shadow: 0 4px 12px rgba(255, 83, 57, 0.34);
  transition: transform $transition;
  &--pwd { left: 5px; transform: translateX(0); }
  &--sms { left: 5px; transform: translateX(100%); }
}

// 表单
.login-form {
  display: block;
}
.login-form .auth-field { margin-bottom: 26px; }

.login-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 4px 2px 22px;
}
.login-remember {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  @include sc(13, $text-body);
  cursor: pointer;
  user-select: none;
  input { position: absolute; opacity: 0; width: 0; height: 0; }
  &__box {
    @include wh(18, 18);
    @include flex-center;
    border: 1.5px solid $border-strong;
    border-radius: 6px;
    background: $bg-card;
    transition: background $transition, border-color $transition, transform $transition;
    svg { opacity: 0; transform: scale(0.5); transition: opacity $transition, transform $transition; }
  }
  &.is-on &__box {
    background: $color-primary;
    border-color: $color-primary;
    svg { opacity: 1; transform: scale(1); }
  }
  input:focus-visible + &__box {
    box-shadow: 0 0 0 3px rgba(255, 83, 57, 0.2);
  }
}
.login-link {
  @include sc(13, $color-primary);
  font-weight: 500;
  &:hover { text-decoration: underline; }
}

.login__hint {
  margin-top: 16px;
  text-align: center;
  @include sc(12, $text-placeholder);
}
.login__tip {
  margin: -14px 2px 18px;
  @include sc(12, $color-success);
  b { letter-spacing: 1px; }
}

// 验证码按钮
.captcha-code {
  @include wh(116, 44);
  @include flex-center;
  border-radius: $radius-md;
  background: $color-primary-soft;
  border: 1px solid rgba(255, 83, 57, 0.2);
  @include sc(18, $color-primary-600);
  font-weight: 700;
  letter-spacing: 3px;
  font-family: 'Courier New', monospace;
  flex-shrink: 0;
  overflow: hidden;
  transition: background $transition, transform $transition;
  &:hover { background: $color-primary-100; }
  &__text {
    display: inline-block;
    animation: code-pop 0.4s ease;
  }
}
@keyframes code-pop {
  0% { opacity: 0; transform: rotateX(90deg); }
  100% { opacity: 1; transform: rotateX(0); }
}
.sms-code {
  @include wh(120, 42);
  @include flex-center;
  border-radius: $radius-md;
  background: $color-primary-soft;
  border: 1px solid rgba(255, 83, 57, 0.2);
  @include sc(13, $color-primary-600);
  font-weight: 600;
  flex-shrink: 0;
  transition: background $transition, color $transition, opacity $transition;
  &:hover:not(:disabled) { background: $color-primary-100; }
  &.is-counting {
    color: $text-placeholder;
    background: $bg-page;
    border-color: $border-color;
    cursor: not-allowed;
  }
  &__num { font-variant-numeric: tabular-nums; }
}

// 全局错误条
.login-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 11px 14px;
  border-radius: $radius-md;
  background: rgba(229, 72, 77, 0.1);
  border: 1px solid rgba(229, 72, 77, 0.25);
  color: $color-danger;
  @include sc(13, $color-danger);
}

// 其他登录方式
.login-social {
  margin-top: 28px;
  text-align: center;
  &__label {
    position: relative;
    display: inline-block;
    @include sc(12, $text-placeholder);
    &::before, &::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 56px;
      height: 1px;
      background: $border-color;
    }
    &::before { right: 100%; margin-right: 12px; }
    &::after { left: 100%; margin-left: 12px; }
  }
  &__row {
    display: flex;
    justify-content: center;
    gap: 18px;
    margin-top: 16px;
  }
}
.social-btn {
  @include wh(48, 48);
  @include flex-center;
  border-radius: 50%;
  border: 1px solid $border-color;
  background: $bg-card;
  transition: transform $transition, box-shadow $transition, border-color $transition;
  &:hover {
    transform: translateY(-3px);
    border-color: $color-primary;
    box-shadow: $shadow-card-hover;
  }
  &:active { transform: translateY(0); }
}

// 成功覆盖层
.login-success {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(244, 245, 247, 0.86);
  backdrop-filter: blur(6px);
}
.login-success__card {
  @include flex-center(column);
  padding: 40px 56px;
  border-radius: $radius-xl;
  background: $bg-card;
  box-shadow: $shadow-pop;
  text-align: center;
  p { margin-top: 16px; @include sc(20, $text-title); font-weight: 700; }
  span { margin-top: 4px; @include sc(13, $text-secondary); }
}
.login-success__check {
  width: 68px;
  height: 68px;
}
.sc-circle {
  stroke-dasharray: 189;
  stroke-dashoffset: 189;
  animation: draw 0.5s ease forwards;
}
.sc-tick {
  stroke-dasharray: 40;
  stroke-dashoffset: 40;
  animation: draw 0.35s ease 0.45s forwards;
}
@keyframes draw { to { stroke-dashoffset: 0; } }

// ===== 入场动画 =====
.login__brand-inner > *,
.login__head,
.login-tabs,
.login-form > *,
.login-social {
  opacity: 0;
  transform: translateY(14px);
}
.login.is-in {
  .login__brand-inner > * { animation: rise 0.6s ease forwards; }
  .login__logo { animation-delay: 0.05s; }
  .login__slogan { animation-delay: 0.15s; }
  .login__points { animation-delay: 0.28s; }
  .login__brand-foot { animation-delay: 0.4s; }
  .login__head { animation: rise 0.6s ease 0.1s forwards; }
  .login-tabs { animation: rise 0.6s ease 0.2s forwards; }
  .login-form > * { animation: rise 0.55s ease forwards; animation-delay: calc(0.3s + var(--d, 0) * 0.07s); }
  .login-social { animation: rise 0.6s ease 0.5s forwards; }
}
@keyframes rise {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}

// 表单切换淡入淡出
.form-swap-enter-active,
.form-swap-leave-active { transition: opacity 0.22s ease, transform 0.22s ease; }
.form-swap-enter { opacity: 0; transform: translateX(14px); }
.form-swap-leave-to { opacity: 0; transform: translateX(-14px); }

.tip-fade-enter-active,
.tip-fade-leave-active { transition: opacity 0.25s ease; }
.tip-fade-enter,
.tip-fade-leave-to { opacity: 0; }

.banner-enter-active,
.banner-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.banner-enter,
.banner-leave-to { opacity: 0; transform: translateY(-6px); }

.success-enter-active { transition: opacity 0.3s ease; }
.success-leave-active { transition: opacity 0.3s ease; }
.success-enter,
.success-leave-to { opacity: 0; }

// 响应式：窄屏隐藏品牌区
@media (max-width: 900px) {
  .login { grid-template-columns: 1fr; }
  .login__brand { display: none; }
  .login__panel { padding: 32px 20px; }
}

@media (prefers-reduced-motion: reduce) {
  .login__brand-inner > *,
  .login__head,
  .login-tabs,
  .login-form > *,
  .login-social { opacity: 1 !important; transform: none !important; animation: none !important; }
  .deco-steam__wisp,
  .deco-chip { animation: none !important; }
  .login__card.is-shake { animation: none !important; }
  * { scroll-behavior: auto; }
}
</style>
