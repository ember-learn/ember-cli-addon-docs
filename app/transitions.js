export default function() {
  this.transition(
    this.hasClass('modal-fade-and-drop'),
    this.use('fadeAndDrop')
  );

  this.transition(
    this.hasClass('modal-fade'),
    this.use('fade', { duration: 150 })
  );
}
