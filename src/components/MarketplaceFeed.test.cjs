const { mount } = require('@vue/test-utils');
const MarketplaceFeed = require('./MarketplaceFeed.vue').default;

const makeSpecimen = ({
  id,
  commonName,
  botanicalName,
  type,
  developmentalStage,
  distanceMiles,
  ownerName,
  ownerHandle,
}) => ({
  id,
  commonName,
  botanicalName,
  cultivar: undefined,
  type,
  developmentalStage,
  nodeCount: 2,
  leafCount: 1,
  variegationStability: 'stable',
  variegationDescription: 'Healthy specimen',
  estimatedValueUsd: 100,
  imageUrl: `/images/${id}.jpg`,
  notes: '',
  owner: {
    id: `owner-${id}`,
    name: ownerName,
    handle: ownerHandle,
    city: 'Portland',
    state: 'OR',
    distanceMiles,
    avatarUrl: `/images/${id}-avatar.jpg`,
    karma: {
      overall: 4.9,
      plantHealth: 5,
      packagingQuality: 5,
      authenticity: 5,
      communication: 5,
      totalTrades: 10,
      joinedYear: 2022,
    },
  },
  passport: {
    id: `passport-${id}`,
    capturedAt: '2026-10-18T14:32:00Z',
    watermarkHash: 'sha256-test',
    isLiveCameraVerified: true,
    city: 'Portland',
    state: 'OR',
    geoCoords: '45.5152° N, 122.6784° W',
    nodeCountStated: 2,
    leafCount: 1,
    variegationClass: 'Stable',
  },
});

const specimens = [
  makeSpecimen({
    id: 'albo',
    commonName: 'Variegated Monstera Albo',
    botanicalName: 'Monstera deliciosa',
    type: 'have',
    developmentalStage: 'rooted_cutting',
    distanceMiles: 8,
    ownerName: 'Ava Rivera',
    ownerHandle: '@ava_plants',
  }),
  makeSpecimen({
    id: 'spiritus',
    commonName: 'Spiritus Sancti',
    botanicalName: 'Philodendron spiritus-sancti',
    type: 'have',
    developmentalStage: 'established',
    distanceMiles: 16,
    ownerName: 'Marcus Chen',
    ownerHandle: '@rare_aroid',
  }),
  makeSpecimen({
    id: 'queen',
    commonName: 'Queen Anthurium',
    botanicalName: 'Anthurium warocqueanum',
    type: 'want',
    developmentalStage: 'established',
    distanceMiles: 0,
    ownerName: 'Elena Vance',
    ownerHandle: '@botanic_elena',
  }),
  makeSpecimen({
    id: 'thai',
    commonName: 'Thai Constellation',
    botanicalName: 'Monstera deliciosa',
    type: 'have',
    developmentalStage: 'established',
    distanceMiles: 46,
    ownerName: 'Talia Jensen',
    ownerHandle: '@talia_roots',
  }),
];

const mountFeed = () => mount(MarketplaceFeed, { props: { specimens } });

const cardNames = (wrapper) =>
  wrapper.findAll('article').map((card) => card.find('h3').text());

const clickButton = async (wrapper, label) => {
  const button = wrapper.findAll('button').find((candidate) => candidate.text().trim() === label);
  if (!button) throw new Error(`Could not find button "${label}"`);
  await button.trigger('click');
};

describe('MarketplaceFeed', () => {
  it('renders all nearby specimens and the verified count', () => {
    const wrapper = mountFeed();

    expect(cardNames(wrapper)).toEqual([
      'Variegated Monstera Albo',
      'Spiritus Sancti',
      'Queen Anthurium',
      'Thai Constellation',
    ]);
    expect(wrapper.text()).toContain('Showing 4 verified specimens');
  });

  it('filters listings by have and want tabs', async () => {
    const wrapper = mountFeed();

    await clickButton(wrapper, 'Have (Available)');
    expect(cardNames(wrapper)).toEqual([
      'Variegated Monstera Albo',
      'Spiritus Sancti',
      'Thai Constellation',
    ]);

    await clickButton(wrapper, 'Want (Wishlist)');
    expect(cardNames(wrapper)).toEqual(['Queen Anthurium']);
  });

  it('searches common names, botanical names, and collector names without case sensitivity', async () => {
    const wrapper = mountFeed();
    const search = wrapper.get('input[placeholder="Search cultivar, species, collector..."]');

    await search.setValue('MONSTERA');
    expect(cardNames(wrapper)).toEqual(['Variegated Monstera Albo', 'Thai Constellation']);

    await search.setValue('spiritus-sancti');
    expect(cardNames(wrapper)).toEqual(['Spiritus Sancti']);

    await search.setValue('RARE_AROID');
    expect(cardNames(wrapper)).toEqual(['Spiritus Sancti']);
  });

  it('combines maturity and radius filters', async () => {
    const wrapper = mountFeed();

    await clickButton(wrapper, '10mi');
    expect(cardNames(wrapper)).toEqual(['Variegated Monstera Albo', 'Queen Anthurium']);

    await wrapper.get('select').setValue('established');
    expect(cardNames(wrapper)).toEqual(['Queen Anthurium']);
  });

  it('shows an empty state and resets all filters', async () => {
    const wrapper = mountFeed();
    const search = wrapper.get('input[placeholder="Search cultivar, species, collector..."]');

    await clickButton(wrapper, '10mi');
    await search.setValue('no matching plant');

    expect(wrapper.findAll('article')).toHaveLength(0);
    expect(wrapper.text()).toContain('No verified specimens match your query.');

    await clickButton(wrapper, 'Reset Filters');
    expect(cardNames(wrapper)).toHaveLength(4);
    expect(wrapper.get('select').element.value).toBe('all');
    expect(search.element.value).toBe('');
  });

  it('emits specimen actions and the passport modal action', async () => {
    const wrapper = mountFeed();
    const alboCard = wrapper.findAll('article').find((card) => card.find('h3').text() === 'Variegated Monstera Albo');

    await clickButton(alboCard, 'Passport');
    expect(wrapper.emitted('inspectPassport')).toEqual([[specimens[0]]]);

    await clickButton(alboCard, 'Propose Trade');
    expect(wrapper.emitted('initiateTrade')).toEqual([[specimens[0]]]);

    await clickButton(wrapper, 'Mint Plant Passport');
    expect(wrapper.emitted('openVerificationModal')).toEqual([[]]);
  });
});
