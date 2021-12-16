/**
 * Enable <Fragment> to prevent unneeded DOM nodes (<div>s) just as component roots.
 * Uses vue-frag as vue-fragment gives issues when using <Fragment> as root node in pages.
 */
import Vue from 'vue'
import { Fragment } from 'vue-frag'

Vue.component('Fragment', Fragment)
