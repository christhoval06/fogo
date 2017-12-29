export async function loadImages({ images, imagesAllLoaded, environment }, limit = 10) {
  const uploads = environment.collections.uploads;
  const orderedCollection = window.firebase
    .firestore()
    .collection(uploads)
    .where('isProduction', '==', true)
    .orderBy('created', 'desc');
  const limitedCollection = orderedCollection.limit(+limit);
  const lastImage = images[images.length - 1];
  const query = (lastImage && limitedCollection.startAfter(lastImage.created)) || limitedCollection;

  const snapshot = await query.get();
  const results = snapshot.docs.map(doc => ({
    __id: doc.id,
    ...doc.data(),
  }));
  
  return {
    images: images.concat(results),
    imagesAllLoaded: results.length < +limit,
  };
}
