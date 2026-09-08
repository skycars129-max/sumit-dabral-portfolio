/* Portfolio content manifest for Sumit Dabral.
 * Sourced from the shared Google Drive "PORTFOLIO" folder.
 * Images are downloaded locally (assets/img); videos stream from Drive
 * via the iframe /preview player, each backed by a local poster frame.
 *
 * Work shape:
 *   { id, cat, title, meta, aspect, poster, fit, media:[ ... ] }
 *   media item: { type:'video', driveId } | { type:'image', src }
 */
(function (root) {
  const V = (driveId) => ({ type: 'video', driveId });
  const I = (src) => ({ type: 'image', src });
  const img = (id, ext) => `assets/img/${id}.${ext}`;
  const post = (driveId) => `assets/poster/${driveId}.jpg`;

  // ---- 3D render sets --------------------------------------------------
  const gasStation = [
    '16cxcPdAVEOEdu4zyCP1pZ96w1Ravj_kV', '1BM7G0eZ6-ZxW6I1DiWCjpI8v0O647L6e',
    '1iIqleaI-ERhVUjF6gDymm_qjfE96Jrbw', '1c5pffuQQcnuafwzaLy6sHxiYCSB5GWqI',
    '1t_zqsnOuuM9PUtlBAiGnLdetsI6WqLAG', '1vBjDBB7z3ot6dXbAfTDQTVbSwoyqbVf9',
    '1KSivfNjXjkxa0aJ1WjShdonlvtjIavvU', '1vKcKs0xYra8b4PugsIiK-ETxC9nRRyba',
    '1t0Y-ltgAIF_Z02wzNmqKlzmwXStPvTA8', '1sFKp2bOujt-BjYBgcbf5ByElTlxXevnd',
  ];
  const carLaunch = [
    '1PiiBV7xOjWEKWVyy3o9q6_apoPCPfIPc', '1C8tkmOMw2jurmPU5cFnHZsaMSp3rNh0f',
    '1BVRnoNNpivuvsY9n_q-zdE_c6dfDDth4', '1QoAQitTJ1fF8YHNsT2ArvFNgt9b52WQo',
    '1fBOtvhDZ-OqRkoqxNpHchJIzcQXtInkJ', '1rW_T9W0g95gTOHY2dybtPRAHwBXBXVJc',
    '1ChyWjz5BuIATTq2uGuEiqBwYuAG10OHo', '14ho1Pc1H0NpgSECLWefdSi1XSerRx6p8',
    '1JgjlpCcCMFfqj-T0i5bO7eOgzpWVMjhC',
  ];

  const works = [];

  // ---- SEC.01  VIDEO EDITING (short-form) ------------------------------
  works.push({
    id: 'edit-showreel', cat: 'video', title: 'Showreel',
    meta: 'Editing · Reel', aspect: '16x9', fit: 'contain',
    poster: post('1KJweoio3H_i7CbBHYoiLYft2OLcUBwUU'),
    media: [V('1KJweoio3H_i7CbBHYoiLYft2OLcUBwUU')],
  });

  [
    '14L60Q8kpwPUSFvtB99erePOaU6wZZTKZ', '19Z0oD2b1b4BkNHsSxZfUZNQH9mgz_8U8',
    '1yu_mSH5F66n7egLBjsH_Q7ugUOeRctXA', '1iC-kPKUIR2Rx-8DpCml7kEbf8vAA9c5r',
    '1jPQB5MXwN1f4UhgZDOzRnz-jyiFTFrWf', '1DRe0cjcmr3QkVf1LjhTLspYiaCBGj_lA',
    '1fjWfpSM2md56VGV0FJanT4tyF4wwsMB0', '13Yo20MXOniju78MUnpTY6RIR3YRGV-Qw',
    '1Sd28aWc6Ixc8GBL-imPOypUIcSvn1U-t', '1oSL-UVPoTWHO6v0I1Q-cWkUtbP6LcCka',
    '1o9Nqar_qfo8TUtWHM9xZffioTSpnNIku', '1sqz9WtiQVRyCMD4ca6Jccvv0n01wlkd2',
  ].forEach((id, i) => {
    works.push({
      id: 'edit-' + (i + 1), cat: 'video', title: 'Short-Form Edit ' + String(i + 1).padStart(2, '0'),
      meta: 'Edit · Cut', aspect: '16x9', fit: 'contain', poster: post(id), media: [V(id)],
    });
  });

  // ---- SEC.02  SPEAKX PRODUCT VIDEOS -----------------------------------
  [
    ['1IJuXaeqQlmJscyQLUmXEjHL_ZwQUkV2u', 'Feature Explainer', '16x9'],
    ['1mRk_HvHpbafQYfGMVM2kvh0__ZykPQ91', 'Landscape Cut', '16x9'],
    ['1Si6PbbJcHPihLv43q8J5qMkzHQ7G-tPi', 'Landscape Promo', '16x9'],
    ['1RxLmM3XNaVrwAQJ5liRtJlyqAOBUmZ0s', 'Feature Promo', '16x9'],
    ['1Wjtzr8P69V0KUA_AdEp2haFCtw5hsoRY', 'Product Film', '16x9'],
    ['1AxRjbxXt6gApB17Z7oIRPGbYNENu7xBD', 'Portrait Reel', '9x16'],
    ['19GBXGB_B2NAsqbxivoMcCXTrJqA6_T4r', 'Portrait Story', '9x16'],
    ['1vyc981Gb7JD4SqFIG6tSXuxfnnfJP4ym', 'Square Promo', '1x1'],
    ['1IJJIMfrOXUKhMh17dpKDZIFSsUlAU3Rt', 'Square Ad', '1x1'],
  ].forEach(([id, title, aspect], i) => {
    works.push({
      id: 'speakx-' + (i + 1), cat: 'speakx', title: 'SpeakX — ' + title,
      meta: 'Motion Graphics · ' + aspect.replace('x', ':'),
      aspect: '16x9', fit: 'contain', poster: post(id), media: [V(id)],
    });
  });

  // ---- SEC.03  3D ENVIRONMENTS -----------------------------------------
  works.push({
    id: 'env-gas', cat: 'env', title: 'Gas Station', meta: '3D Environment · Cinematic',
    aspect: '16x9', fit: 'cover', poster: img(gasStation[0], 'png'),
    media: [V('1lmfYfBGEnmVTlCkL4kuXUteOKoQBNnFu'), ...gasStation.map((id) => I(img(id, 'png')))],
  });
  works.push({
    id: 'env-car', cat: 'env', title: 'Car Launch Event', meta: '3D Environment · Event Reveal',
    aspect: '16x9', fit: 'cover', poster: img(carLaunch[0], 'png'),
    media: carLaunch.map((id) => I(img(id, 'png'))),
  });
  works.push({
    id: 'env-dance', cat: 'env', title: 'Animated Character Dance', meta: '3D Animation · Loop',
    aspect: '16x9', fit: 'contain', poster: post('1V3b-OFior05JKwU13iGcWvxoCNbqXoae'),
    media: [V('1V3b-OFior05JKwU13iGcWvxoCNbqXoae')],
  });

  // ---- SEC.04  3D OBJECTS ----------------------------------------------
  works.push({
    id: 'obj-ball', cat: 'obj', title: 'AI Assistant Ball', meta: 'Product 3D · Motion',
    aspect: '16x9', fit: 'contain', poster: img('1aqOEnFW07PazPkdkgI3m8X1-5QImml7U', 'png'),
    media: [V('19vUm-i_8Of2v7aACACr3GM4G8d80cdZ3'), I(img('1aqOEnFW07PazPkdkgI3m8X1-5QImml7U', 'png'))],
  });
  works.push({
    id: 'obj-bat', cat: 'obj', title: 'Bat Character', meta: 'Character 3D · Model',
    aspect: '16x9', fit: 'contain', poster: img('15Z2lyyQFEJlZo4_LWkLrLVB-Ph_vLev1', 'jpg'),
    media: [I(img('15Z2lyyQFEJlZo4_LWkLrLVB-Ph_vLev1', 'jpg')), I(img('1MxOEGuljPCMlzSyRebaQP5SzqAzLQK_A', 'jpg'))],
  });
  works.push({
    id: 'obj-coffee', cat: 'obj', title: 'Coffee Shop', meta: '3D Environment · Interior',
    aspect: '16x9', fit: 'contain', poster: img('1_aVMtiEv3RDlJxufXywo5Fk_-iwf4rFz', 'png'),
    media: [I(img('1_aVMtiEv3RDlJxufXywo5Fk_-iwf4rFz', 'png'))],
  });
  works.push({
    id: 'obj-light', cat: 'obj', title: 'Lighting Study', meta: '3D Lighting · Look-dev',
    aspect: '16x9', fit: 'contain', poster: img('1sVWxkfNxvooo32MFX0J7AavU8kMSh3D8', 'png'),
    media: [I(img('1sVWxkfNxvooo32MFX0J7AavU8kMSh3D8', 'png'))],
  });

  // ---- SEC.05  GRAPHIC DESIGN ----------------------------------------
  // Brand campaign sets — one card per brand, opens as a swipeable set.
  const brand = (id, ext) => `assets/img/graphic-${id}.${ext}`;
  const brandSet = (slug, count, ext) => {
    const frames = [];
    for (let k = 1; k <= count; k++) frames.push(I(brand(`${slug}-${String(k).padStart(2, '0')}`, ext)));
    return frames;
  };
  [
    { slug: 'dlecta', title: "D'lecta", meta: 'Brand Campaign · Social', count: 9, ext: 'png' },
    { slug: 'hamleys', title: 'Hamleys', meta: 'Brand Campaign · Key Art', count: 4, ext: 'png' },
    { slug: 'bobbi', title: 'Bobbi Brown', meta: 'Beauty · Social', count: 4, ext: 'png' },
    { slug: 'neurogen', title: 'Neurogen', meta: 'Brand Campaign · Social', count: 7, ext: 'jpg' },
  ].forEach((b) => {
    works.push({
      id: 'graphic-' + b.slug, cat: 'graphic', title: b.title, meta: b.meta,
      aspect: '16x9', fit: 'contain', poster: brand(`${b.slug}-01`, b.ext),
      media: brandSet(b.slug, b.count, b.ext),
    });
  });
  works.push({
    id: 'graphic-stride', cat: 'graphic', title: 'Stride', meta: 'Brand Campaign · Social',
    aspect: '16x9', fit: 'contain', poster: brand('stride-01', 'png'),
    media: [
      I(brand('stride-01', 'png')), I(brand('stride-02', 'avif')),
      I(brand('stride-03', 'avif')), I(brand('stride-04', 'avif')),
    ],
  });
  works.push({
    id: 'graphic-1', cat: 'graphic', title: 'Nexus', meta: 'Print · Key Art',
    aspect: '16x9', fit: 'contain', poster: img('1I1nMpeJ25-URbRsJyd3vLSfKmhuHmbvc', 'jpg'),
    media: [I(img('1I1nMpeJ25-URbRsJyd3vLSfKmhuHmbvc', 'jpg'))],
  });

  // ---- SEC.06  ANIMATED FILMS ----------------------------------------
  [
    ['11wlNdNnD-sOOBgwq23jWUcZjm99Tzbkt', 'Antariksh Ke Lie Bani Hu Mei'],
    ['1NML6HEL1o0Gq8kmjLExuW2NXlWGv3KZ9', 'Pihu'],
    ['1YTHLq55_FOaXZSDzBplcKRyRtP9Ut45c', 'Sea Sorrow'],
    ['1PY1u1mvCT48JUWVr-D03Vjfy11paNCxG', 'The Digital Paradox'],
  ].forEach(([id, title], i) => {
    works.push({
      id: 'anim-' + (i + 1), cat: 'animated', title: title,
      meta: 'Animated Film · Short', aspect: '16x9', fit: 'contain',
      poster: post(id), media: [V(id)],
    });
  });

  root.PORTFOLIO_DATA = {
    filters: [
      { key: 'all', label: 'All Work' },
      { key: 'video', label: 'Video Editing' },
      { key: 'speakx', label: 'SpeakX' },
      { key: 'env', label: '3D Environments' },
      { key: 'obj', label: '3D Objects' },
      { key: 'graphic', label: 'Graphic Design' },
      { key: 'animated', label: 'Animated Films' },
    ],
    works,
  };
})(typeof window !== 'undefined' ? window : globalThis);
