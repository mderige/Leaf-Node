const { mount } = require('@vue/test-utils');
const Navbar = require('./Navbar.vue').default;

const mountNavbar = (props = {}) =>
  mount(Navbar, {
    props: {
      activeTab: 'marketplace',
      matchCount: 3,
      ...props,
    },
  });

const findNavButton = (wrapper, label) =>
  wrapper.findAll('nav button').find((button) => button.text().includes(label));

describe('Navbar', () => {
  it('renders the brand, navigation links, and verification action', () => {
    const wrapper = mountNavbar();

    expect(wrapper.text()).toContain('Leaf & Node');
    expect(wrapper.text()).toContain('Marketplace & Wishlists');
    expect(wrapper.text()).toContain('1:1 Matchmaker');
    expect(wrapper.text()).toContain('Proof of Life Studio');
    expect(wrapper.text()).toContain('Trade Chat & Weather');
    expect(wrapper.text()).toContain('Verify Specimen');
  });

  it.each([
    ['Marketplace & Wishlists', 'marketplace'],
    ['1:1 Matchmaker', 'matchmaker'],
    ['Proof of Life Studio', 'verification'],
    ['Trade Chat & Weather', 'chat'],
  ])('emits the %s tab when selected', async (label, tab) => {
    const wrapper = mountNavbar();
    const button = findNavButton(wrapper, label);

    expect(button).toBeDefined();
    await button.trigger('click');

    expect(wrapper.emitted('update:activeTab')).toEqual([[tab]]);
  });

  it('marks the current tab active', () => {
    const wrapper = mountNavbar({ activeTab: 'matchmaker' });

    expect(findNavButton(wrapper, '1:1 Matchmaker').classes()).toContain('text-[#227C5B]');
    expect(findNavButton(wrapper, '1:1 Matchmaker').classes()).toContain('border-[#227C5B]');
    expect(findNavButton(wrapper, 'Marketplace & Wishlists').classes()).toContain('border-transparent');
  });

  it('shows a match-count badge only when matches are available', () => {
    const wrapper = mountNavbar({ matchCount: 2 });

    expect(findNavButton(wrapper, '1:1 Matchmaker').text()).toContain('2');
  });

  it('does not show a match-count badge when there are no matches', () => {
    const wrapper = mountNavbar({ matchCount: 0 });

    expect(findNavButton(wrapper, '1:1 Matchmaker').text()).toBe('1:1 Matchmaker');
  });

  it('returns to the marketplace when the wordmark is clicked', async () => {
    const wrapper = mountNavbar({ activeTab: 'chat' });

    await wrapper.get('header .group').trigger('click');

    expect(wrapper.emitted('update:activeTab')).toEqual([['marketplace']]);
  });

  it('emits an event when Verify Specimen is clicked', async () => {
    const wrapper = mountNavbar();
    const button = wrapper.findAll('button').find((candidate) => candidate.text().includes('Verify Specimen'));

    expect(button).toBeDefined();
    await button.trigger('click');

    expect(wrapper.emitted('openVerificationModal')).toEqual([[]]);
  });
});
